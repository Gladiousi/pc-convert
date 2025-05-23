import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { PowerScores } from "./types";

interface AuthRequest extends Request {
  user?: { userId: number; role: string };
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

const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access denied" });
    return;
  }

  try {
    const decoded = await verify(token, JWT_SECRET) as { userId: number; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};

const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({ error: "Доступ только для администраторов" });
    return;
  }
  next();
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

    const token = sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token });
  })
);

app.get(
  "/components",
  authenticateToken,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const components = await prisma.component.findMany();
    res.json(components);
  })
);

app.get(
  "/components/filter",
  authenticateToken,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { type, socket, ramType, interface: storageInterface, gpuConnector } = req.query;

    const filters: any = {};
    if (type) filters.type = type;
    if (socket) filters.socket = socket;
    if (ramType) filters.ramType = ramType;
    if (storageInterface) filters.interface = storageInterface;
    if (gpuConnector) filters.gpuConnector = gpuConnector;

    const components = await prisma.component.findMany({
      where: filters,
    });

    res.json(components);
  })
);

app.get(
  "/components",
  authenticateToken,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const components = await prisma.component.findMany();

    const powerScores: PowerScores = {
      cpu: {},
      gpu: {},
      ram: {},
      storage: {},
      motherboard: {},
      psu: {},
    };
    const sockets: Set<string> = new Set();

    components.forEach((component) => {
      const { name, type, power, socket, connector, ramType, interface: storageInterface, storageInterfaces, gpuConnector } = component;

      switch (type) {
        case "CPU":
          if (socket) {
            powerScores.cpu[name] = { power, socket };
            sockets.add(socket);
          }
          break;
        case "GPU":
          if (connector) {
            powerScores.gpu[name] = { power, connector };
          }
          break;
        case "RAM":
          if (ramType) {
            powerScores.ram[name] = { power, type: ramType };
          }
          break;
        case "Storage":
          if (storageInterface) {
            powerScores.storage[name] = { power, interface: storageInterface };
          }
          break;
        case "Motherboard":
          if (socket && ramType && gpuConnector) {
            powerScores.motherboard[name] = {
              power,
              socket,
              ramType,
              gpuConnector,
              storageInterface: storageInterfaces || [],
            };
            sockets.add(socket);
          }
          break;
        case "PSU":
          powerScores.psu[name] = { power };
          break;
      }
    });

    res.json({
      powerScores,
      sockets: Array.from(sockets),
    });
  })
);

app.put(
  "/admin/components/:id",
  authenticateToken,
  isAdmin,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const {
      name,
      type,
      power,
      socket,
      connector,
      ramType,
      interface: storageInterface,
      storageInterfaces,
      gpuConnector,
    } = req.body;

    const component = await prisma.component.update({
      where: { id: parseInt(id) },
      data: {
        name,
        type,
        power,
        socket,
        connector,
        ramType,
        interface: storageInterface,
        storageInterfaces: storageInterfaces || [],
        gpuConnector,
      },
    });

    res.json({ message: "Компонент обновлен", component });
  })
);

app.delete(
  "/admin/components/:id",
  authenticateToken,
  isAdmin,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await prisma.component.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Компонент удален" });
  })
);

app.get(
  "/compare",
  authenticateToken,
  (req: AuthRequest, res: Response) => {
    res.json({ message: "This is a protected route", user: req.user });
  }
);

app.get(
  "/admin/users",
  authenticateToken,
  isAdmin,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true },
    });
    res.json(users);
  })
);

app.use((err: Error, req: AuthRequest, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});