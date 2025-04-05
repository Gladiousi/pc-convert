import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

interface AuthRequest extends Request {
    user?: { userId: number, role: string };
}

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

app.use(cors());
app.use(express.json());

const asyncHandler = (fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ error: "Access denied" });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: "Invalid token" });
            return;
        }
        req.user = decoded as { userId: number, role: string };
        next();
    });
};

app.post(
    "/register",
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email и пароль обязательны" });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: "USER",
                },
            });
            res.status(201).json({ message: "User created", userId: user.id });
        } catch (error: any) {
            if (error.code === "P2002") {
                return res.status(400).json({ error: "Этот email уже зарегистрирован" });
            }
            console.error("Registration error:", error);
            throw error; 
        }
    })
);

app.post(
    "/login",
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
        res.json({ token });
    })
);

app.get("/compare", authenticateToken, (req: AuthRequest, res: Response) => {
    res.json({ message: "This is a protected route", user: req.user });
});

app.get("/admin/users", authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== "ADMIN") {
        return res.status(403).json({ error: "Доступ только для администраторов" });
    }
    const users = await prisma.user.findMany({
        select: { id: true, email: true, role: true, createdAt: true },
    });
    res.json(users);
}));

app.use((err: Error, req: AuthRequest, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});