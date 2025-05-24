# PC Configurator

PC Configurator — это современное веб-приложение для сборки и сравнения конфигураций персональных компьютеров. Пользователи могут выбирать комплектующие, проверять их совместимость и сравнивать производительность двух сборок. Приложение включает панель администратора для управления пользователями и добавления новых компонентов, обеспечивая удобный интерфейс как для обычных пользователей, так и для администраторов.

Frontend построен на **React**, **TypeScript** и **Vite**, с использованием **Tailwind CSS** для стилизации и **Zustand** для управления состоянием. Backend использует **Prisma** и **PostgreSQL** для хранения данных. Проект оптимизирован для производительности, типобезопасности и удобства поддержки, с модульной структурой компонентов и строгими типами TypeScript.

## Возможности

- **Сравнение ПК**: Соберите две конфигурации ПК, проверьте совместимость комплектующих (сокет процессора, тип RAM, разъёмы видеокарты) и сравните их мощность.
- **Панель администратора**: Управляйте пользователями и добавляйте комплектующие через форму с выпадающими списками для стандартизированного ввода.
- **Аутентификация**: Безопасный доступ с использованием токенов для защищённых страниц (Сравнение и Админка).
- **Адаптивный дизайн**: Интерфейс оптимизирован для работы на десктопах и мобильных устройствах благодаря Tailwind CSS.
- **Типобезопасность**: Использование TypeScript для предотвращения ошибок на этапе разработки.
- **Быстрая разработка**: Vite обеспечивает горячую перезагрузку модулей (HMR) и быструю сборку.

## Технологический стек

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Zustand
- **Backend**: ExpressJS, Prisma ORM, PostgreSQL
- **Инструменты**: ESLint (с поддержкой типизации), Prettier

## Структура проекта

```
📦src
 ┣ 📂components
 ┃ ┣ 📂admin
 ┃ ┃ ┣ 📜ComponentForm.tsx
 ┃ ┃ ┣ 📜TabSelector.tsx
 ┃ ┃ ┗ 📜UserManagement.tsx
 ┃ ┣ 📂common
 ┃ ┃ ┣ 📜Alert.tsx
 ┃ ┃ ┣ 📜Card.tsx
 ┃ ┃ ┣ 📜ErrorList.tsx
 ┃ ┃ ┣ 📜GradientButton.tsx
 ┃ ┃ ┣ 📜PageContainer.tsx
 ┃ ┃ ┣ 📜SectionHeading.tsx
 ┃ ┃ ┣ 📜Select.tsx
 ┃ ┃ ┗ 📜TabSelector.tsx
 ┃ ┣ 📂compare
 ┃ ┃ ┣ 📜ConfigResult.tsx
 ┃ ┃ ┣ 📜PCConfigForm.tsx
 ┃ ┃ ┗ 📜SocketSelector.tsx
 ┃ ┣ 📜Auth.tsx
 ┃ ┣ 📜Faq.tsx
 ┃ ┣ 📜Footer.tsx
 ┃ ┗ 📜Header.tsx
 ┣ 📂data
 ┃ ┣ 📜faq.ts
 ┃ ┣ 📜pc.ts
 ┃ ┗ 📜pcData.ts
 ┣ 📂hooks
 ┃ ┣ 📜useApi.ts
 ┃ ┣ 📜useComponentData.ts
 ┃ ┣ 📜useComponentOptions.ts
 ┃ ┗ 📜useForm.ts
 ┣ 📂interface
 ┃ ┣ 📜admin.ts
 ┃ ┣ 📜common.ts
 ┃ ┣ 📜compare.ts
 ┃ ┣ 📜hooks.ts
 ┃ ┣ 📜page.ts
 ┃ ┣ 📜pc.ts
 ┃ ┗ 📜store.ts
 ┣ 📂page
 ┃ ┣ 📜About.tsx
 ┃ ┣ 📜Admin.tsx
 ┃ ┣ 📜Assemble.tsx
 ┃ ┣ 📜Compare.tsx
 ┃ ┣ 📜Home.tsx
 ┃ ┗ 📜View.tsx
 ┣ 📂routes
 ┃ ┗ 📜main.tsx
 ┣ 📂store
 ┃ ┣ 📜activePage.ts
 ┃ ┗ 📜useTabStore.ts
 ┣ 📂utils
 ┃ ┣ 📜option.ts
 ┃ ┗ 📜page.ts
 ┣ 📜App.tsx
 ┣ 📜index.css
 ┣ 📜main.tsx
 ┗ 📜vite-env.d.ts
```

- **components**: Модульные UI-компоненты, организованные по страницам (admin, compare) и общие компоненты (Auth, Header и т.д.).
- **data**: Утилиты и типы для получения данных о комплектующих и проверки совместимости.
- **page**: Компоненты страниц для различных маршрутов.
- **routes**: Логика маршрутизации через Zustand.
- **store**: Zustand-магазин для управления глобальным состоянием (токен, активная вкладка, данные о комплектующих).

## Требования

- **Node.js**: v18 или выше
- **PostgreSQL**: v14 или выше
- **npm**: v8 или выше

## Инструкции по установке

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-repo/pc-configurator.git
cd pc-configurator
```

### 2. Установка зависимостей

Установка зависимотей для frontend

```bash
cd front
npm install
```

Установка зависимостей для backend

```bash
cd back
npm install
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корневой директории и добавьте:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pc_configurator?schema=public"
VITE_API_URL="http://localhost:5000"
```

- Замените `user`, `password` и `pc_configurator` на ваши учетные данные PostgreSQL и имя базы данных.
- `VITE_API_URL` указывает на адрес backend-сервера.

### 4. Настройка базы данных

Примените миграции Prisma для создания схемы базы данных:

```bash
npx prisma migrate dev --name init
```

Просмотрите схему базы данных с помощью Prisma Studio:

```bash
npx prisma studio
```

Схема включает две основные модели:
- **User**: Хранит данные пользователей (email, пароль, роль и т.д.).
- **Component**: Хранит информацию о комплектующих (название, тип, мощность, сокет и т.д.).

### 5. Запуск backend

Запустите backend-сервер (предполагается, что backend находится в отдельной директории):

```bash
npm run start
```

Backend должен быть доступен по адресу `http://localhost:5000`.

### 6. Запуск frontend

Запустите сервер разработки Vite:

```bash
npm run dev
```

Откройте `http://localhost:5173` в браузере.

### 7. Сборка для продакшена

```bash
npm run build
```

Запустите продакшен-сборку:

```bash
npm run preview
```

## Использование

1. **Главная страница**: Ознакомьтесь с приложением и перейдите на другие страницы.
2. **Страница сравнения**:
   - Войдите или зарегистрируйтесь для доступа.
   - Выберите сокет для каждого ПК или же настройте комплектующие сами, подберите комплектующие и нажмите "Сравнить" для оценки производительности ПК.
   - Проверка совместимости гарантирует корректные конфигурации (например, совпадение сокетов процессора и материнской платы).
3. **Страница конфигурации ПК**:
  - Войдите или зарегистрируйтесь для доступа.
  - Выберите сокет для ПК или же настройте комплектующие сами и нажмите "Рассчитать мощность" для оценки производительности ПК.
  - Проверка совместимости гарантирует корректные конфигурации (например, совпадение сокетов процессора и материнской платы).
4. **Панель администратора**:
   - Доступна для пользователей с ролью `ADMIN`.
   - Просматривайте и управляйте пользователями или добавляйте новые комплектующие через форму с выпадающими списками.
5. **Страница "О проекте"**: Узнайте больше о приложении.
6. **Страница авторизации**: Войдите или зарегистрируйтесь для доступа к защищённым функциям.

## Настройка ESLint

Проект использует ESLint с поддержкой типизации для строгой проверки кода. Для настройки:

1. Обновите `eslint.config.js` для активации правил с учётом типов:

```js
import tseslint from 'typescript-eslint'

export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
})
```

2. Добавьте правила для React:

```js
import react from 'eslint-plugin-react'

export default tseslint.config({
  settings: { react: { version: '18.3' } },
  plugins: { react },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

3. Установите плагин для React:

```bash
npm install eslint-plugin-react --save-dev
```

## Внесение изменений

Приветствуются любые улучшения! Чтобы внести вклад:

1. Сделайте форк репозитория.
2. Создайте ветку для новой функциональности (`git checkout -b feature/ваша-фича`).
3. Зафиксируйте изменения (`git commit -m "Добавлена новая фича"`).
4. Отправьте ветку в репозиторий (`git push origin feature/ваша-фича`).
5. Откройте Pull Request.

Убедитесь, что ваш код соответствует правилам ESLint и Prettier и сохраняет типобезопасность TypeScript.

## Контакты

По вопросам или для обратной связи пишите на [sypchiknasevere@gmail.com](mailto:sypchiknasevere@gmail.com) или создайте issue на GitHub.

---

*PC Configurator создан для упрощения выбора и сравнения компьютерных комплектующих. Приятного использования!*