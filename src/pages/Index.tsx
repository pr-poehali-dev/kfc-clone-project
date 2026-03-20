/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

// ─── Типы ────────────────────────────────────────────────────────────────────

interface User {
  email: string;
  password: string;
  name: string;
  crowns: number;
  cardLinked: boolean;
  cardNumber?: string;
  cardBank?: string;
  orders: Order[];
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  size?: string;
  qty: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: string;
  city: string;
}

// ─── Данные меню ──────────────────────────────────────────────────────────────

const SNACKS = [
  {
    id: "burger",
    name: "Роял Бургер",
    emoji: "🍔",
    image: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/47f765d1-4e71-4828-8967-867676bb941f.jpg",
    description: "Сочная котлета, топлёный сыр, карамелизированный лук",
    sizes: null,
    price: 299,
  },
  {
    id: "pizza",
    name: "Лунная Пицца",
    emoji: "🍕",
    image: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/b0caf312-64f4-4dc1-8b99-a33b09a7dec2.jpg",
    description: "Тонкое тесто, моцарелла, томатный соус, премиум начинки",
    sizes: [
      { label: "Мал", price: 136 },
      { label: "Сред", price: 272 },
      { label: "Бол", price: 544 },
    ],
    price: 136,
  },
  {
    id: "fries",
    name: "Картошка Фри",
    emoji: "🍟",
    image: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/40f7077b-2d18-4153-a8eb-3acbbad1f84d.jpg",
    description: "Хрустящая картошка с фирменной приправой LunaKing",
    sizes: [
      { label: "Мал", price: 89 },
      { label: "Сред", price: 178 },
      { label: "Бол", price: 356 },
    ],
    price: 89,
  },
  {
    id: "nuggets",
    name: "Наггетсы",
    emoji: "🍗",
    image: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/a45bf5a6-28fd-4068-8d5c-d7c90399de35.jpg",
    description: "10 кусочков куриного филе в золотистой панировке",
    sizes: null,
    price: 249,
  },
];

const DRINKS = [
  { id: "cola", name: "Кола Лунная", emoji: "🥤", price: 129, desc: "Классическая кола со льдом" },
  { id: "lemon", name: "Лимонад Золотой", emoji: "🍋", price: 149, desc: "Свежий имбирно-лимонный лимонад" },
  { id: "shake", name: "Молочный Шейк", emoji: "🥛", price: 189, desc: "Густой шейк из натурального молока" },
  { id: "juice", name: "Сок Манго", emoji: "🥭", price: 99, desc: "Свежевыжатый манговый сок" },
  { id: "coffee", name: "Кофе Луна", emoji: "☕", price: 159, desc: "Двойной эспрессо с карамелью" },
  { id: "water", name: "Вода Премиум", emoji: "💧", price: 82, desc: "Негазированная горная вода" },
];

const CITIES = [
  { name: "Москва", x: 48, y: 38, count: 47 },
  { name: "СПб", x: 42, y: 28, count: 23 },
  { name: "Казань", x: 55, y: 38, count: 12 },
  { name: "Екатеринбург", x: 63, y: 36, count: 18 },
  { name: "Новосибирск", x: 70, y: 38, count: 9 },
  { name: "Сочи", x: 47, y: 52, count: 6 },
  { name: "Самара", x: 57, y: 42, count: 8 },
];

// ─── Локальное хранилище ──────────────────────────────────────────────────────

const STORAGE_KEY = "lunaking_users";
const SESSION_KEY = "lunaking_session";

function getUsers(): User[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}
function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}
function saveSession(email: string) {
  localStorage.setItem(SESSION_KEY, email);
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function Index() {
  const [page, setPage] = useState<string>("home");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const email = getSession();
    if (email) {
      const users = getUsers();
      const user = users.find((u) => u.email === email);
      if (user) setCurrentUser(user);
    }
  }, []);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const updateUser = (updated: User) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.email === updated.email);
    if (idx >= 0) users[idx] = updated;
    saveUsers(users);
    setCurrentUser(updated);
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const key = item.id + (item.size || "");
      const existing = prev.find((i) => i.id + (i.size || "") === key);
      if (existing) return prev.map((i) => i.id + (i.size || "") === key ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    notify(`${item.name} добавлен в корзину 👑`);
  };

  const removeFromCart = (id: string, size?: string) => {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="min-h-screen" style={{ background: "#0D0D0D", color: "#EDE8DC" }}>
      {/* Уведомление */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in"
          style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A)", color: "#0D0D0D", padding: "10px 24px", borderRadius: 999, fontWeight: 700, fontSize: 14, boxShadow: "0 4px 30px rgba(201,168,76,0.5)", zIndex: 9999 }}>
          {notification}
        </div>
      )}

      {/* Корзина */}
      {showCart && (
        <CartModal
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
          onOrder={() => {
            if (!currentUser) { notify("Войдите в аккаунт для заказа"); setShowCart(false); setPage("auth"); return; }
            if (!currentUser.cardLinked) { notify("Привяжите карту в Настройках"); setShowCart(false); setPage("settings"); return; }
            setPage("nfc");
            setShowCart(false);
          }}
          total={cartTotal}
        />
      )}

      {/* Навбар */}
      <Navbar page={page} setPage={setPage} cartCount={cartCount} onCartOpen={() => setShowCart(true)} currentUser={currentUser} />

      {/* Контент */}
      <main className="pb-24 md:pb-0">
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "menu" && <MenuPage addToCart={addToCart} />}
        {page === "recommendations" && <RecommendationsPage addToCart={addToCart} />}
        {page === "orders" && <OrdersPage currentUser={currentUser} setPage={setPage} />}
        {page === "settings" && <SettingsPage currentUser={currentUser} updateUser={updateUser} notify={notify} setPage={setPage} />}
        {page === "profile" && <ProfilePage currentUser={currentUser} setPage={setPage} onLogout={() => { clearSession(); setCurrentUser(null); setPage("home"); }} />}
        {page === "auth" && <AuthPage onAuth={(u: User) => { setCurrentUser(u); saveSession(u.email); setPage("home"); notify("Добро пожаловать, " + u.name + "!"); }} notify={notify} />}
        {page === "nfc" && <NFCPage cart={cart} total={cartTotal} currentUser={currentUser} updateUser={updateUser} onDone={() => { setCart([]); setPage("orders"); notify("Заказ оформлен! +4 короны 👑"); }} />}
      </main>

      {/* Нижняя навигация (мобильная) */}
      <BottomNav page={page} setPage={setPage} cartCount={cartCount} onCartOpen={() => setShowCart(true)} />
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ page, setPage, cartCount, onCartOpen, currentUser }: any) {
  return (
    <header style={{ background: "rgba(13,13,13,0.97)", borderBottom: "1px solid #252525", backdropFilter: "blur(20px)" }}
      className="sticky top-0 z-40 hidden md:flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage("home")}>
        <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #C9A84C, #E8C96A)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👑</div>
        <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 700, color: "#C9A84C", letterSpacing: "0.05em" }}>LunaKing</span>
      </div>

      <nav className="flex items-center gap-8">
        {[
          { id: "home", label: "Главная" },
          { id: "menu", label: "Меню" },
          { id: "recommendations", label: "Рекомендации" },
          { id: "orders", label: "Заказы" },
        ].map((item) => (
          <button key={item.id} onClick={() => setPage(item.id)}
            style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: page === item.id ? "#C9A84C" : "#9E9586", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer" }}>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button onClick={onCartOpen} style={{ position: "relative" as const, background: "none", border: "none", cursor: "pointer", color: "#9E9586" }}>
          <Icon name="ShoppingCart" size={22} />
          {cartCount > 0 && (
            <span className="crown-badge absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center" style={{ fontSize: 10 }}>{cartCount}</span>
          )}
        </button>
        <button onClick={() => setPage(currentUser ? "profile" : "auth")}
          style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A)", color: "#0D0D0D", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em" }}>
          {currentUser ? currentUser.name.split(" ")[0] : "Войти"}
        </button>
      </div>
    </header>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────

function BottomNav({ page, setPage, cartCount, onCartOpen }: any) {
  const items = [
    { id: "home", icon: "Home", label: "Главная" },
    { id: "menu", icon: "UtensilsCrossed", label: "Меню" },
    { id: "cart", icon: "ShoppingCart", label: "Корзина", cart: true },
    { id: "recommendations", icon: "Star", label: "Для вас" },
    { id: "profile", icon: "User", label: "Профиль" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{ background: "rgba(13,13,13,0.98)", borderTop: "1px solid #252525", backdropFilter: "blur(20px)" }}>
      <div className="flex">
        {items.map((item) => (
          <button key={item.id} onClick={() => item.cart ? onCartOpen() : setPage(item.id)}
            className="flex-1 flex flex-col items-center py-3 gap-1"
            style={{ background: "none", border: "none", cursor: "pointer", color: (!item.cart && page === item.id) ? "#C9A84C" : "#555" }}>
            <div style={{ position: "relative" as const }}>
              <Icon name={item.icon} size={20} />
              {item.cart && cartCount > 0 && (
                <span className="crown-badge absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center" style={{ fontSize: 9 }}>{cartCount}</span>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── Главная страница ─────────────────────────────────────────────────────────

function HomePage({ setPage }: any) {
  return (
    <div>
      <section className="relative overflow-hidden" style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 map-grid opacity-30" />

        <div className="relative z-10 text-center px-6 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, transparent, #C9A84C, transparent)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase" as const, color: "#C9A84C", fontWeight: 600 }}>Премиум Быстрое Питание</span>
            <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, transparent, #C9A84C, transparent)" }} />
          </div>

          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(56px, 12vw, 120px)", fontWeight: 700, lineHeight: 0.9, letterSpacing: "-0.02em", color: "#EDE8DC" }}>
            Luna<span style={{ color: "#C9A84C" }}>King</span>
          </h1>

          <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: "#9E9586", marginTop: 24, maxWidth: 500, margin: "24px auto 0", lineHeight: 1.6, fontWeight: 300 }}>
            Королевский вкус каждый день.<br />Накапливай короны — получай привилегии.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button onClick={() => setPage("menu")}
              style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A)", color: "#0D0D0D", border: "none", borderRadius: 8, padding: "16px 40px", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
              Смотреть меню
            </button>
            <button onClick={() => setPage("recommendations")}
              style={{ background: "none", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 8, padding: "16px 40px", fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
              Рекомендации
            </button>
          </div>
        </div>

        <div className="absolute" style={{ width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(201,168,76,0.08)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
        <div className="absolute" style={{ width: 700, height: 700, borderRadius: "50%", border: "1px solid rgba(201,168,76,0.04)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      </section>

      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "Crown", title: "Система Корон", desc: "Каждые 4 короны = скидка 2% на любую закуску" },
            { icon: "Zap", title: "Быстрая Доставка", desc: "Горячая еда за 25 минут или бесплатно" },
            { icon: "Shield", title: "Премиум Качество", desc: "Только свежие ингредиенты высшего сорта" },
          ].map((f, i) => (
            <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s`, background: "#141414", border: "1px solid #252525", borderRadius: 16, padding: 28 }}>
              <div style={{ width: 48, height: 48, background: "rgba(201,168,76,0.12)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon name={f.icon} size={22} style={{ color: "#C9A84C" }} />
              </div>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 700, color: "#EDE8DC", marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Меню ─────────────────────────────────────────────────────────────────────

function MenuPage({ addToCart }: any) {
  const [tab, setTab] = useState<"snacks" | "drinks">("snacks");

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 700, color: "#EDE8DC", marginBottom: 8 }}>
        Наше <span style={{ color: "#C9A84C" }}>Меню</span>
      </h2>
      <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, #C9A84C, transparent)", marginBottom: 32 }} />

      <div className="flex gap-2 mb-10">
        {(["snacks", "drinks"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "10px 28px", borderRadius: 8, fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.2s",
              background: tab === t ? "linear-gradient(135deg, #C9A84C, #E8C96A)" : "#141414",
              color: tab === t ? "#0D0D0D" : "#9E9586",
              border: tab === t ? "none" : "1px solid #252525" }}>
            {t === "snacks" ? "🍔 Закуски" : "🥤 Напитки"}
          </button>
        ))}
      </div>

      {tab === "snacks" && <SnacksGrid addToCart={addToCart} items={SNACKS} />}
      {tab === "drinks" && <DrinksGrid addToCart={addToCart} />}
    </div>
  );
}

// ─── Сетка закусок ────────────────────────────────────────────────────────────

function SnacksGrid({ addToCart, items }: any) {
  const [sizes, setSizes] = useState<Record<string, string>>({});

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {items.map((item: any, i: number) => {
        const selectedSize = sizes[item.id] || (item.sizes ? item.sizes[0].label : null);
        const sizeObj = item.sizes ? item.sizes.find((s: any) => s.label === selectedSize) : null;
        const price = sizeObj ? sizeObj.price : item.price;

        return (
          <div key={item.id} className="animate-fade-in"
            style={{ animationDelay: `${i * 0.07}s`, background: "#141414", border: "1px solid #252525", borderRadius: 20, overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(201,168,76,0.15)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>
            <div style={{ height: 200, overflow: "hidden" }}>
              <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: 24 }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 700, color: "#EDE8DC", marginBottom: 6 }}>{item.name}</h3>
              <p style={{ fontSize: 12, color: "#777", marginBottom: 16, lineHeight: 1.5 }}>{item.description}</p>

              {item.sizes && (
                <div className="flex gap-2 mb-4">
                  {item.sizes.map((s: any) => (
                    <button key={s.label} onClick={() => setSizes((prev) => ({ ...prev, [item.id]: s.label }))}
                      style={{ padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                        background: selectedSize === s.label ? "rgba(201,168,76,0.2)" : "transparent",
                        color: selectedSize === s.label ? "#C9A84C" : "#666",
                        border: selectedSize === s.label ? "1px solid #C9A84C" : "1px solid #333" }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 700, color: "#C9A84C" }}>{price} ₽</span>
                <button onClick={() => addToCart({ id: item.id, name: item.name + (selectedSize ? ` (${selectedSize})` : ""), price, size: selectedSize || undefined, image: item.image, qty: 1 })}
                  style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A)", color: "#0D0D0D", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  + В корзину
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Сетка напитков ───────────────────────────────────────────────────────────

function DrinksGrid({ addToCart }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {DRINKS.map((d, i) => (
        <div key={d.id} className="animate-fade-in"
          style={{ animationDelay: `${i * 0.06}s`, background: "#141414", border: "1px solid #252525", borderRadius: 16, padding: 24, transition: "transform 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{d.emoji}</div>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: "#EDE8DC", marginBottom: 4 }}>{d.name}</h3>
          <p style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>{d.desc}</p>
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 700, color: "#C9A84C" }}>{d.price} ₽</span>
            <button onClick={() => addToCart({ id: d.id, name: d.name, price: d.price, image: d.emoji, qty: 1 })}
              style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A)", color: "#0D0D0D", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              + В корзину
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Рекомендации ─────────────────────────────────────────────────────────────

function RecommendationsPage({ addToCart }: any) {
  const [tab, setTab] = useState<"snacks" | "drinks">("snacks");

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 700, color: "#EDE8DC", marginBottom: 8 }}>
        Реко<span style={{ color: "#C9A84C" }}>мендации</span>
      </h2>
      <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, #C9A84C, transparent)", marginBottom: 16 }} />
      <p style={{ fontSize: 14, color: "#777", marginBottom: 32 }}>Специально подобрано шеф-поваром LunaKing</p>

      <div className="mb-10 animate-fade-in" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.05))", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 16, padding: 24 }}>
        <div className="flex items-center gap-4">
          <div style={{ fontSize: 40 }}>👑</div>
          <div>
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 700, color: "#C9A84C" }}>Система Корон LunaKing</h3>
            <p style={{ fontSize: 13, color: "#9E9586", marginTop: 4 }}>Каждые <strong style={{ color: "#E8C96A" }}>4 короны</strong> = скидка <strong style={{ color: "#E8C96A" }}>2%</strong> на любую закуску. Короны начисляются за каждый заказ.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        {(["snacks", "drinks"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "10px 28px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              background: tab === t ? "linear-gradient(135deg, #C9A84C, #E8C96A)" : "#141414",
              color: tab === t ? "#0D0D0D" : "#9E9586",
              border: tab === t ? "none" : "1px solid #252525" }}>
            {t === "snacks" ? "🍔 Закуски" : "🥤 Напитки"}
          </button>
        ))}
      </div>

      {tab === "snacks" && <SnacksGrid addToCart={addToCart} items={SNACKS} />}
      {tab === "drinks" && <DrinksGrid addToCart={addToCart} />}
    </div>
  );
}

// ─── Заказы ───────────────────────────────────────────────────────────────────

function OrdersPage({ currentUser, setPage }: any) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6">
        <div style={{ fontSize: 64, marginBottom: 20 }}>👑</div>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, color: "#EDE8DC", marginBottom: 12 }}>Требуется авторизация</h3>
        <p style={{ color: "#777", marginBottom: 24, textAlign: "center" as const }}>Войдите в аккаунт, чтобы видеть историю заказов</p>
        <button onClick={() => setPage("auth")} style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A)", color: "#0D0D0D", border: "none", borderRadius: 8, padding: "14px 36px", fontWeight: 700, cursor: "pointer" }}>
          Войти
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 700, color: "#EDE8DC", marginBottom: 8 }}>
        Мои <span style={{ color: "#C9A84C" }}>Заказы</span>
      </h2>
      <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, #C9A84C, transparent)", marginBottom: 32 }} />

      {/* Карта */}
      <div className="mb-10 animate-fade-in" style={{ background: "#141414", border: "1px solid #252525", borderRadius: 20, padding: 32, overflow: "hidden" }}>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#C9A84C", marginBottom: 20 }}>🗺️ Карта присутствия LunaKing</h3>
        <div className="relative map-grid" style={{ height: 280, borderRadius: 12, overflow: "hidden", background: "#0A0A0A" }}>
          <svg viewBox="0 0 100 65" className="absolute inset-0 w-full h-full" style={{ opacity: 0.12 }} preserveAspectRatio="none">
            <path d="M8 18 Q18 12 30 16 Q42 11 52 14 Q62 10 72 13 Q80 11 88 15 Q93 18 94 24 Q90 30 84 28 Q80 34 72 30 Q67 36 60 32 Q54 38 46 34 Q38 40 30 37 Q22 42 16 38 Q10 34 7 28 Z" fill="#C9A84C" />
          </svg>
          {CITIES.map((city) => (
            <div key={city.name}
              onMouseEnter={() => setHoveredCity(city.name)}
              onMouseLeave={() => setHoveredCity(null)}
              style={{ position: "absolute" as const, left: `${city.x}%`, top: `${city.y}%`, transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#C9A84C", boxShadow: `0 0 ${hoveredCity === city.name ? 20 : 8}px rgba(201,168,76,${hoveredCity === city.name ? 0.8 : 0.5})`, transition: "all 0.2s" }} />
              {hoveredCity === city.name && (
                <div style={{ position: "absolute" as const, bottom: 18, left: "50%", transform: "translateX(-50%)", background: "#1A1A1A", border: "1px solid #C9A84C", borderRadius: 8, padding: "6px 12px", fontSize: 11, color: "#EDE8DC", whiteSpace: "nowrap" as const, zIndex: 20 }}>
                  <div style={{ fontWeight: 700, color: "#C9A84C" }}>{city.name}</div>
                  <div>{city.count} ресторанов</div>
                </div>
              )}
            </div>
          ))}
          <div style={{ position: "absolute" as const, bottom: 12, left: 16, fontSize: 11, color: "#444" }}>Наведи на точку для деталей</div>
        </div>
      </div>

      {/* История заказов */}
      {currentUser.orders && currentUser.orders.length > 0 ? (
        <div className="flex flex-col gap-4">
          {currentUser.orders.map((order: Order) => (
            <div key={order.id} className="animate-fade-in" style={{ background: "#141414", border: "1px solid #252525", borderRadius: 16, padding: 24 }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span style={{ fontSize: 12, color: "#555" }}>#{order.id}</span>
                  <span style={{ fontSize: 12, color: "#555", marginLeft: 16 }}>{order.date}</span>
                </div>
                <span style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C", borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{order.status}</span>
              </div>
              <div style={{ fontSize: 13, color: "#9E9586", marginBottom: 8 }}>
                {order.items.map((i: CartItem) => `${i.name} ×${i.qty}`).join(", ")}
              </div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 700, color: "#C9A84C" }}>{order.total} ₽</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div style={{ fontSize: 56, marginBottom: 16 }}>🛍️</div>
          <p style={{ color: "#555", fontSize: 16 }}>Заказов пока нет. Сделайте первый!</p>
        </div>
      )}
    </div>
  );
}

// ─── Настройки ────────────────────────────────────────────────────────────────

function SettingsPage({ currentUser, updateUser, notify, setPage }: any) {
  const [cardNumber, setCardNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState<"sber" | "tbank" | null>(null);
  const [linking, setLinking] = useState(false);
  const [linked, setLinked] = useState(false);

  useEffect(() => {
    if (currentUser?.cardLinked) setLinked(true);
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6">
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, color: "#EDE8DC", marginBottom: 12 }}>Требуется авторизация</h3>
        <button onClick={() => setPage("auth")} style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A)", color: "#0D0D0D", border: "none", borderRadius: 8, padding: "14px 36px", fontWeight: 700, cursor: "pointer" }}>Войти</button>
      </div>
    );
  }

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleLinkCard = () => {
    if (!selectedBank) { notify("Выберите банк"); return; }
    if (cardNumber.replace(/\s/g, "").length < 16) { notify("Введите полный номер карты (16 цифр)"); return; }
    setLinking(true);
    setTimeout(() => {
      setLinking(false);
      setLinked(true);
      const updated = { ...currentUser, cardLinked: true, cardNumber: cardNumber, cardBank: selectedBank };
      updateUser(updated);
      notify("Карта успешно привязана! 🎉");
    }, 3000);
  };

  const crownsDiscount = Math.floor((currentUser.crowns || 0) / 4) * 2;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 700, color: "#EDE8DC", marginBottom: 8 }}>
        Нас<span style={{ color: "#C9A84C" }}>тройки</span>
      </h2>
      <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, #C9A84C, transparent)", marginBottom: 32 }} />

      {/* Короны */}
      <div className="mb-6 animate-fade-in" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.05))", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 16, padding: 24 }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#C9A84C", marginBottom: 4 }}>👑 Мои Короны</h3>
            <p style={{ fontSize: 13, color: "#9E9586" }}>Каждые 4 короны = скидка 2% на любую закуску</p>
          </div>
          <div style={{ textAlign: "right" as const }}>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 42, fontWeight: 700, color: "#C9A84C", lineHeight: 1 }}>{currentUser.crowns || 0}</div>
            <div style={{ fontSize: 11, color: "#9E9586" }}>корон</div>
          </div>
        </div>
        {crownsDiscount > 0 && (
          <div style={{ marginTop: 12, background: "rgba(201,168,76,0.15)", borderRadius: 8, padding: "8px 16px", fontSize: 13, color: "#C9A84C", fontWeight: 600 }}>
            ✨ Доступная скидка: {crownsDiscount}% на следующую закуску
          </div>
        )}
      </div>

      {/* Привязка карты */}
      <div className="animate-fade-in" style={{ animationDelay: "0.1s", background: "#141414", border: "1px solid #252525", borderRadius: 16, padding: 28 }}>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 700, color: "#EDE8DC", marginBottom: 20 }}>
          💳 Привязка карты
        </h3>

        {linked ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: 48, height: 48, borderRadius: 12, background: currentUser.cardBank === "sber" ? "rgba(29,185,84,0.2)" : "rgba(255,221,45,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                {currentUser.cardBank === "sber" ? "🏦" : "🟡"}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: "#EDE8DC" }}>{currentUser.cardBank === "sber" ? "Сбербанк" : "Т-Банк"}</div>
                <div style={{ fontSize: 13, color: "#666" }}>•••• •••• •••• {(currentUser.cardNumber || "").replace(/\s/g, "").slice(-4)}</div>
              </div>
              <div style={{ marginLeft: "auto", background: "rgba(34,197,94,0.15)", color: "#22C55E", borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>✓ Привязана</div>
            </div>
            <button onClick={() => { setLinked(false); const u = { ...currentUser, cardLinked: false, cardNumber: undefined, cardBank: undefined }; updateUser(u); notify("Карта отвязана"); }}
              style={{ background: "none", color: "#666", border: "1px solid #333", borderRadius: 8, padding: "10px 20px", fontSize: 13, cursor: "pointer", width: "100%" }}>
              Отвязать карту
            </button>
          </div>
        ) : linking ? (
          <div className="flex flex-col items-center py-8">
            <div style={{ width: 64, height: 64, border: "3px solid rgba(201,168,76,0.3)", borderTop: "3px solid #C9A84C", borderRadius: "50%", marginBottom: 16 }}
              className="spin-anim" />
            <p style={{ color: "#C9A84C", fontWeight: 600, fontSize: 16 }}>Подождите, идёт привязка карты...</p>
            <p style={{ color: "#555", fontSize: 13, marginTop: 8 }}>Это займёт несколько секунд</p>
            <style>{`.spin-anim { animation: spin-card 1s linear infinite; } @keyframes spin-card { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 13, color: "#777", marginBottom: 20 }}>Привяжите карту для оплаты через NFC</p>

            <div className="flex gap-3 mb-6">
              {[
                { id: "sber" as const, label: "Сбербанк", emoji: "🏦", color: "#1DB954" },
                { id: "tbank" as const, label: "Т-Банк", emoji: "🟡", color: "#FFDD2D" },
              ].map((bank) => (
                <button key={bank.id} onClick={() => setSelectedBank(bank.id)}
                  style={{ flex: 1, padding: "16px 12px", borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
                    background: selectedBank === bank.id ? `rgba(${bank.id === "sber" ? "29,185,84" : "255,221,45"},0.12)` : "#0D0D0D",
                    border: `2px solid ${selectedBank === bank.id ? bank.color : "#252525"}`,
                    color: "#EDE8DC", textAlign: "center" as const }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{bank.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{bank.label}</div>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: "#777", display: "block", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>Номер карты</label>
              <input value={cardNumber} onChange={(e) => setCardNumber(formatCard(e.target.value))} placeholder="0000 0000 0000 0000" maxLength={19}
                style={{ width: "100%", background: "#0D0D0D", border: "1px solid #333", borderRadius: 10, padding: "14px 16px", fontSize: 18, color: "#EDE8DC", letterSpacing: "0.1em", outline: "none", fontFamily: "Montserrat, sans-serif", boxSizing: "border-box" as const }}
                onFocus={(e) => { e.target.style.borderColor = "#C9A84C"; }}
                onBlur={(e) => { e.target.style.borderColor = "#333"; }} />
            </div>

            <button onClick={handleLinkCard}
              style={{ width: "100%", background: "linear-gradient(135deg, #C9A84C, #E8C96A)", color: "#0D0D0D", border: "none", borderRadius: 10, padding: "16px", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em" }}>
              Привязать карту
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Профиль ──────────────────────────────────────────────────────────────────

function ProfilePage({ currentUser, setPage, onLogout }: any) {
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6">
        <div style={{ fontSize: 64, marginBottom: 20 }}>👤</div>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, color: "#EDE8DC", marginBottom: 12 }}>Вы не вошли</h3>
        <button onClick={() => setPage("auth")} style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A)", color: "#0D0D0D", border: "none", borderRadius: 8, padding: "14px 36px", fontWeight: 700, cursor: "pointer" }}>
          Войти / Зарегистрироваться
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 700, color: "#EDE8DC", marginBottom: 32 }}>
        Про<span style={{ color: "#C9A84C" }}>филь</span>
      </h2>

      <div className="animate-fade-in" style={{ background: "#141414", border: "1px solid #252525", borderRadius: 20, padding: 32, textAlign: "center" as const, marginBottom: 16 }}>
        <div style={{ width: 80, height: 80, background: "linear-gradient(135deg, #C9A84C, #E8C96A)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px" }}>👑</div>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 700, color: "#EDE8DC", marginBottom: 4 }}>{currentUser.name}</h3>
        <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>{currentUser.email}</p>

        <div className="flex justify-center gap-8">
          <div style={{ textAlign: "center" as const }}>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 700, color: "#C9A84C" }}>{currentUser.crowns || 0}</div>
            <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Корон</div>
          </div>
          <div style={{ width: 1, background: "#252525" }} />
          <div style={{ textAlign: "center" as const }}>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 700, color: "#C9A84C" }}>{(currentUser.orders || []).length}</div>
            <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Заказов</div>
          </div>
          <div style={{ width: 1, background: "#252525" }} />
          <div style={{ textAlign: "center" as const }}>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 700, color: "#C9A84C" }}>{currentUser.cardLinked ? "✓" : "—"}</div>
            <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Карта</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button onClick={() => setPage("settings")} style={{ background: "#141414", color: "#EDE8DC", border: "1px solid #252525", borderRadius: 12, padding: "16px 24px", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="Settings" size={18} style={{ color: "#C9A84C" }} /> Настройки
        </button>
        <button onClick={() => setPage("orders")} style={{ background: "#141414", color: "#EDE8DC", border: "1px solid #252525", borderRadius: 12, padding: "16px 24px", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="Package" size={18} style={{ color: "#C9A84C" }} /> Мои заказы
        </button>
        <button onClick={onLogout} style={{ background: "none", color: "#555", border: "1px solid #252525", borderRadius: 12, padding: "16px 24px", fontSize: 14, cursor: "pointer" }}>
          Выйти
        </button>
      </div>
    </div>
  );
}

// ─── Авторизация ──────────────────────────────────────────────────────────────

function AuthPage({ onAuth, notify }: any) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    const users = getUsers();

    if (mode === "register") {
      if (!name.trim()) { setError("Введите имя"); return; }
      if (!email.includes("@")) { setError("Неверный формат email"); return; }
      if (password.length < 6) { setError("Пароль минимум 6 символов"); return; }
      if (users.length >= 2) { setError("Достигнут лимит аккаунтов (максимум 2)"); return; }
      if (users.find((u) => u.email === email)) { setError("Этот email уже зарегистрирован"); return; }

      const newUser: User = { email, password, name, crowns: 0, cardLinked: false, orders: [] };
      saveUsers([...users, newUser]);
      onAuth(newUser);
    } else {
      const user = users.find((u) => u.email === email && u.password === password);
      if (!user) { setError("Неверный email или пароль"); return; }
      onAuth(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-10">
          <div style={{ fontSize: 48, marginBottom: 12 }}>👑</div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 40, fontWeight: 700, color: "#EDE8DC" }}>
            {mode === "login" ? "Вход" : "Регистрация"}
          </h2>
          <p style={{ color: "#666", fontSize: 13, marginTop: 8 }}>
            {mode === "login" ? "Добро пожаловать в LunaKing" : "Создайте королевский аккаунт"}
          </p>
        </div>

        <div style={{ background: "#141414", border: "1px solid #252525", borderRadius: 20, padding: 32 }}>
          {mode === "register" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: "#777", display: "block", marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Ваше имя</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Иван Королёв"
                style={{ width: "100%", background: "#0D0D0D", border: "1px solid #333", borderRadius: 10, padding: "14px 16px", fontSize: 15, color: "#EDE8DC", outline: "none", boxSizing: "border-box" as const }}
                onFocus={(e) => { e.target.style.borderColor = "#C9A84C"; }}
                onBlur={(e) => { e.target.style.borderColor = "#333"; }} />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: "#777", display: "block", marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" type="email"
              style={{ width: "100%", background: "#0D0D0D", border: "1px solid #333", borderRadius: 10, padding: "14px 16px", fontSize: 15, color: "#EDE8DC", outline: "none", boxSizing: "border-box" as const }}
              onFocus={(e) => { e.target.style.borderColor = "#C9A84C"; }}
              onBlur={(e) => { e.target.style.borderColor = "#333"; }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11, color: "#777", display: "block", marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Пароль</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password"
              style={{ width: "100%", background: "#0D0D0D", border: "1px solid #333", borderRadius: 10, padding: "14px 16px", fontSize: 15, color: "#EDE8DC", outline: "none", boxSizing: "border-box" as const }}
              onFocus={(e) => { e.target.style.borderColor = "#C9A84C"; }}
              onBlur={(e) => { e.target.style.borderColor = "#333"; }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }} />
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 16px", fontSize: 13, color: "#EF4444", marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit}
            style={{ width: "100%", background: "linear-gradient(135deg, #C9A84C, #E8C96A)", color: "#0D0D0D", border: "none", borderRadius: 10, padding: "16px", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
            {mode === "login" ? "Войти" : "Создать аккаунт"}
          </button>

          {mode === "register" && (
            <p style={{ fontSize: 12, color: "#555", textAlign: "center" as const, marginTop: 16 }}>
              Максимум 2 аккаунта на устройство
            </p>
          )}
        </div>

        <div className="text-center mt-6">
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            style={{ background: "none", border: "none", color: "#C9A84C", fontSize: 14, cursor: "pointer" }}>
            {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Корзина (модальное окно) ─────────────────────────────────────────────────

function CartModal({ cart, onClose, onRemove, onOrder, total }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="w-full max-w-md cart-slide"
        style={{ background: "#141414", border: "1px solid #252525", borderRadius: "20px 20px 0 0", padding: 28, maxHeight: "80vh", overflow: "auto" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 700, color: "#EDE8DC" }}>🛒 Корзина</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 22, lineHeight: 1 }}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
            <p style={{ color: "#555" }}>Корзина пуста</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 mb-6">
              {cart.map((item: CartItem) => (
                <div key={item.id + (item.size || "")} className="flex items-center gap-3"
                  style={{ background: "#0D0D0D", borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 28, width: 40, textAlign: "center" as const }}>
                    {item.image && item.image.startsWith("http") ? "🍽️" : item.image}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#EDE8DC" }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>×{item.qty}</div>
                  </div>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: "#C9A84C" }}>{item.price * item.qty} ₽</div>
                  <button onClick={() => onRemove(item.id, item.size)} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", padding: "4px" }}>
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #252525", paddingTop: 20 }}>
              <div className="flex justify-between items-center mb-6">
                <span style={{ color: "#9E9586", fontSize: 14 }}>Итого</span>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 700, color: "#C9A84C" }}>{total} ₽</span>
              </div>
              <button onClick={onOrder}
                style={{ width: "100%", background: "linear-gradient(135deg, #C9A84C, #E8C96A)", color: "#0D0D0D", border: "none", borderRadius: 12, padding: "18px", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em" }}>
                📱 Оплатить через NFC
              </button>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes cart-slide-in { from { transform: translateY(100%); } to { transform: translateY(0); } } .cart-slide { animation: cart-slide-in 0.3s ease-out; }`}</style>
    </div>
  );
}

// ─── NFC Оплата ───────────────────────────────────────────────────────────────

function NFCPage({ cart, total, currentUser, updateUser, onDone }: any) {
  const [step, setStep] = useState<"wait" | "processing" | "done">("wait");

  const handleNFC = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("done");
      if (currentUser) {
        const newOrder: Order = {
          id: Math.random().toString(36).slice(2, 8).toUpperCase(),
          date: new Date().toLocaleDateString("ru-RU"),
          items: cart,
          total,
          status: "Выполнен",
          city: "Москва",
        };
        const updated: User = {
          ...currentUser,
          crowns: (currentUser.crowns || 0) + 4,
          orders: [newOrder, ...(currentUser.orders || [])],
        };
        updateUser(updated);
      }
      setTimeout(onDone, 2500);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm w-full animate-fade-in">
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 40, fontWeight: 700, color: "#EDE8DC", marginBottom: 8 }}>
          Оплата NFC
        </h2>
        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 700, color: "#C9A84C", marginBottom: 48 }}>{total} ₽</p>

        {step === "wait" && (
          <>
            <div onClick={handleNFC} className="cursor-pointer mx-auto animate-pulse-gold"
              style={{ width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.04) 70%)", border: "2px solid rgba(201,168,76,0.4)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, transition: "transform 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}>
              <div style={{ textAlign: "center" as const }}>
                <div style={{ fontSize: 52, marginBottom: 8 }}>📱</div>
                <div style={{ fontSize: 11, color: "#C9A84C", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>NFC</div>
              </div>
            </div>
            <p style={{ color: "#9E9586", fontSize: 15, marginBottom: 8, fontWeight: 500 }}>Приложите телефон к терминалу</p>
            <p style={{ color: "#444", fontSize: 12 }}>Или нажмите на иконку для симуляции оплаты</p>
          </>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center">
            <div className="mx-auto nfc-process-spin" style={{ width: 180, height: 180, borderRadius: "50%", border: "3px solid rgba(201,168,76,0.15)", borderTop: "3px solid #C9A84C", marginBottom: 28 }} />
            <p style={{ color: "#C9A84C", fontSize: 16, fontWeight: 700 }}>Обработка платежа...</p>
            <p style={{ color: "#555", fontSize: 13, marginTop: 8 }}>Не убирайте телефон</p>
            <style>{`.nfc-process-spin { animation: nfc-spin 1s linear infinite; } @keyframes nfc-spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center">
            <div className="mx-auto animate-scale-in"
              style={{ width: 180, height: 180, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "2px solid #22C55E", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 72 }}>✅</div>
            </div>
            <p style={{ color: "#22C55E", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Оплата прошла!</p>
            <p style={{ color: "#C9A84C", fontSize: 14 }}>+4 короны добавлены в ваш аккаунт 👑</p>
          </div>
        )}
      </div>
    </div>
  );
}