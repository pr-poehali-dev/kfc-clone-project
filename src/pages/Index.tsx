/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

// ─── Типы ─────────────────────────────────────────────────────────────────────

interface User {
  email: string; password: string; name: string; crowns: number;
  cardLinked: boolean; cardNumber?: string; cardBank?: string; orders: Order[];
}
interface CartItem { id: string; name: string; price: number; size?: string; qty: number; image: string; }
interface Order { id: string; date: string; items: CartItem[]; total: number; status: string; city: string; }
interface MenuItem { id: string; name: string; image: string; description: string; sizes?: {label:string;price:number}[]|null; price: number; tag?: string; }

// ─── Меню ─────────────────────────────────────────────────────────────────────

const IMG = {
  burger1: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/47f765d1-4e71-4828-8967-867676bb941f.jpg",
  burger2: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/2fc04d34-2863-47bb-8d31-e71f3079caba.jpg",
  burger3: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/3dfbad97-5b6a-4e3f-800e-ad92acd6c111.jpg",
  burger4: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/dfa60053-7e08-4f1d-9d56-8029cd11aae4.jpg",
  burger5: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/c427f61e-8093-4654-977a-8e9bf0ec3577.jpg",
  burger6: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/48d96be1-420a-43a2-a722-7d800a20c025.jpg",
  pizza1: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/b0caf312-64f4-4dc1-8b99-a33b09a7dec2.jpg",
  pizza2: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/3dd0cc28-e642-4615-9a45-46f9210e2957.jpg",
  pizza3: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/7dc01ab7-4408-439a-87b5-c5ef1478dd43.jpg",
  fries: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/40f7077b-2d18-4153-a8eb-3acbbad1f84d.jpg",
  nuggets: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/a45bf5a6-28fd-4068-8d5c-d7c90399de35.jpg",
  waffles: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/111963bb-8578-436c-a881-e0f167844c60.jpg",
  cheesecake: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/fc8434b8-de88-4ce1-a8b4-f281e74d02d1.jpg",
  shashlik: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/fd050369-a537-4053-8515-89d5f8dd320a.jpg",
  drinks: "https://cdn.poehali.dev/projects/41ce2871-e018-46e3-a6a2-69d7bfd919b5/files/50bc490a-13bd-4a85-b8cd-15cc4c8b7817.jpg",
};

const BURGERS: MenuItem[] = [
  { id:"b1", name:"Роял Бургер", image:IMG.burger1, description:"Сочная говяжья котлета, топлёный чеддер, карамелизированный лук, фирменный соус", price:299, tag:"Хит" },
  { id:"b2", name:"Вопер Люкс", image:IMG.burger2, description:"Двойная котлета, листья айсберга, томаты, маринованные огурцы, майонез, кетчуп", price:399, tag:"Топ" },
  { id:"b3", name:"Крипси Чикен", image:IMG.burger3, description:"Хрустящее куриное филе в панировке, острый соус, листья салата, томат", price:349 },
  { id:"b4", name:"Дабл Чиз", image:IMG.burger4, description:"Две котлеты, двойной чеддер, маринованные огурцы, горчица, кетчуп", price:379 },
  { id:"b5", name:"BBQ Бэкон", image:IMG.burger5, description:"Говяжья котлета, хрустящий бекон, соус BBQ, кольца лука, сыр смокед", price:429, tag:"Новинка" },
  { id:"b6", name:"Гриль Грибной", image:IMG.burger6, description:"Котлета гриль, обжаренные шампиньоны, швейцарский сыр, трюфельный майонез", price:449 },
];

const PIZZAS: MenuItem[] = [
  { id:"p1", name:"Лунная Маргарита", image:IMG.pizza1, description:"Томатный соус, моцарелла буффала, свежий базилик, оливковое масло", sizes:[{label:"Мал",price:136},{label:"Сред",price:272},{label:"Бол",price:544}], price:136 },
  { id:"p2", name:"Пеперони Ройал", image:IMG.pizza2, description:"Томатный соус, моцарелла, пикантные колбаски пеперони, орегано", sizes:[{label:"Мал",price:189},{label:"Сред",price:378},{label:"Бол",price:756}], price:189, tag:"Хит" },
  { id:"p3", name:"Четыре Сыра", image:IMG.pizza3, description:"Моцарелла, пармезан, горгонзола, чеддер, белый соус, грецкий орех", sizes:[{label:"Мал",price:219},{label:"Сред",price:438},{label:"Бол",price:876}], price:219, tag:"Топ" },
];

const SNACKS: MenuItem[] = [
  { id:"f1", name:"Картошка Фри", image:IMG.fries, description:"Хрустящая картошка с фирменной приправой LunaKing", sizes:[{label:"Мал",price:89},{label:"Сред",price:178},{label:"Бол",price:356}], price:89 },
  { id:"n1", name:"Наггетсы", image:IMG.nuggets, description:"10 кусочков куриного филе в золотистой панировке, соус на выбор", price:249 },
  { id:"sh1", name:"Шашлык Королевский", image:IMG.shashlik, description:"Шашлык из мраморной говядины на углях, маринад из трав и специй, 3 шампура", price:799, tag:"Премиум" },
];

const DESSERTS: MenuItem[] = [
  { id:"w1", name:"Вафли Люкс", image:IMG.waffles, description:"Хрустящие бельгийские вафли, сахарная пудра, карамельный соус, шарик мороженого", price:199 },
  { id:"ck1", name:"Чизкейк Нью-Йорк", image:IMG.cheesecake, description:"Классический нью-йоркский чизкейк, соус из лесных ягод, сахарная пудра", price:269, tag:"Топ" },
];

const DRINKS = [
  { id:"cola", name:"Кока-Кола", emoji:"🥤", price:129, desc:"Классическая Coca-Cola со льдом", color:"#C62828" },
  { id:"pepsi", name:"Пепси", emoji:"🥤", price:119, desc:"Pepsi Cola охлаждённая", color:"#1565C0" },
  { id:"fanta", name:"Фанта", emoji:"🍊", price:119, desc:"Освежающая Fanta апельсин", color:"#E65100" },
  { id:"sprite", name:"Спрайт", emoji:"💚", price:119, desc:"Sprite лимон-лайм, без сахара", color:"#2E7D32" },
  { id:"lemon", name:"Лимонад Золотой", emoji:"🍋", price:149, desc:"Домашний имбирно-лимонный лимонад", color:"#F9A825" },
  { id:"shake", name:"Молочный Шейк", emoji:"🥛", price:189, desc:"Густой шейк из натурального молока", color:"#6D4C41" },
  { id:"juice", name:"Сок Манго", emoji:"🥭", price:99, desc:"Свежевыжатый манговый сок", color:"#EF6C00" },
  { id:"coffee", name:"Кофе Луна", emoji:"☕", price:159, desc:"Двойной эспрессо с карамелью", color:"#4E342E" },
  { id:"water", name:"Вода Премиум", emoji:"💧", price:82, desc:"Негазированная горная вода", color:"#0277BD" },
];

// ─── Хранилище ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "lunaking_users";
const SESSION_KEY = "lunaking_session";
function getUsers(): User[] { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]"); } catch { return []; } }
function saveUsers(u: User[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); }
function getSession() { return localStorage.getItem(SESSION_KEY); }
function saveSession(e: string) { localStorage.setItem(SESSION_KEY, e); }
function clearSession() { localStorage.removeItem(SESSION_KEY); }

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function Index() {
  const [page, setPage] = useState("home");
  const [currentUser, setCurrentUser] = useState<User|null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [notification, setNotification] = useState<string|null>(null);

  useEffect(() => {
    const email = getSession();
    if (email) { const u = getUsers().find(u=>u.email===email); if(u) setCurrentUser(u); }
  }, []);

  const notify = (msg: string) => { setNotification(msg); setTimeout(()=>setNotification(null),3000); };

  const updateUser = (updated: User) => {
    const users = getUsers();
    const idx = users.findIndex(u=>u.email===updated.email);
    if(idx>=0) users[idx]=updated; else users.push(updated);
    saveUsers(users); setCurrentUser(updated);
  };

  const addToCart = (item: CartItem) => {
    setCart(prev=>{
      const key=item.id+(item.size||"");
      const ex=prev.find(i=>i.id+(i.size||"")===key);
      if(ex) return prev.map(i=>i.id+(i.size||"")===key?{...i,qty:i.qty+1}:i);
      return [...prev,{...item,qty:1}];
    });
    notify(`${item.name} добавлен 👑`);
  };

  const removeFromCart = (id:string, size?:string) => setCart(prev=>prev.filter(i=>!(i.id===id&&i.size===size)));
  const cartTotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);

  return (
    <div style={{background:"#0A0A0A",color:"#EDE8DC",minHeight:"100vh"}}>
      {notification && (
        <div className="fixed left-1/2 -translate-x-1/2 z-[9999] animate-fade-in"
          style={{top:16,background:"linear-gradient(135deg,#C9A84C,#E8C96A)",color:"#0D0D0D",padding:"10px 24px",borderRadius:999,fontWeight:700,fontSize:14,boxShadow:"0 4px 30px rgba(201,168,76,0.5)"}}>
          {notification}
        </div>
      )}

      {showCart && <CartModal cart={cart} total={cartTotal} onClose={()=>setShowCart(false)} onRemove={removeFromCart}
        onOrder={()=>{
          if(!currentUser){notify("Войдите для заказа");setShowCart(false);setPage("auth");return;}
          if(!currentUser.cardLinked){notify("Привяжите карту в Настройках");setShowCart(false);setPage("settings");return;}
          setPage("nfc");setShowCart(false);
        }} />}

      <Navbar page={page} setPage={setPage} cartCount={cartCount} onCartOpen={()=>setShowCart(true)} currentUser={currentUser}/>
      <main className="pb-24 md:pb-0">
        {page==="home"        && <HomePage setPage={setPage}/>}
        {page==="menu"        && <MenuPage addToCart={addToCart}/>}
        {page==="recommendations" && <RecommendationsPage addToCart={addToCart}/>}
        {page==="orders"      && <OrdersPage currentUser={currentUser} setPage={setPage}/>}
        {page==="settings"    && <SettingsPage currentUser={currentUser} updateUser={updateUser} notify={notify} setPage={setPage}/>}
        {page==="profile"     && <ProfilePage currentUser={currentUser} setPage={setPage} onLogout={()=>{clearSession();setCurrentUser(null);setPage("home");}}/>}
        {page==="auth"        && <AuthPage onAuth={(u:User)=>{setCurrentUser(u);saveSession(u.email);setPage("home");notify("Добро пожаловать, "+u.name+"!");}} notify={notify}/>}
        {page==="nfc"         && <NFCPage cart={cart} total={cartTotal} currentUser={currentUser} updateUser={updateUser} onDone={()=>{setCart([]);setPage("orders");notify("Заказ оформлен! +4 короны 👑");}}/>}
      </main>
      <BottomNav page={page} setPage={setPage} cartCount={cartCount} onCartOpen={()=>setShowCart(true)}/>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar({page,setPage,cartCount,onCartOpen,currentUser}:any) {
  return (
    <header style={{background:"rgba(10,10,10,0.97)",borderBottom:"1px solid #1E1E1E",backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:40}}
      className="hidden md:flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-3 cursor-pointer" onClick={()=>setPage("home")}>
        <div style={{width:40,height:40,background:"linear-gradient(135deg,#C9A84C,#E8C96A)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👑</div>
        <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:26,fontWeight:700,color:"#C9A84C",letterSpacing:"0.05em"}}>LunaKing</span>
      </div>
      <nav className="flex items-center gap-7">
        {[["home","Главная"],["menu","Меню"],["recommendations","Рекомендации"],["orders","Заказы"]].map(([id,label])=>(
          <button key={id} onClick={()=>setPage(id)}
            style={{fontSize:12,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase" as const,
              color:page===id?"#C9A84C":"#7A7060",background:"none",border:"none",cursor:"pointer",
              borderBottom:page===id?"2px solid #C9A84C":"2px solid transparent",paddingBottom:2,transition:"all 0.2s"}}>
            {label}
          </button>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <button onClick={onCartOpen} style={{position:"relative" as const,background:"none",border:"none",cursor:"pointer",color:"#7A7060"}}>
          <Icon name="ShoppingCart" size={22}/>
          {cartCount>0&&<span style={{position:"absolute",top:-8,right:-8,background:"linear-gradient(135deg,#C9A84C,#E8C96A)",color:"#0D0D0D",borderRadius:999,width:18,height:18,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>}
        </button>
        <button onClick={()=>setPage(currentUser?"profile":"auth")}
          style={{background:"linear-gradient(135deg,#C9A84C,#E8C96A)",color:"#0D0D0D",border:"none",borderRadius:8,padding:"9px 22px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
          {currentUser?currentUser.name.split(" ")[0]:"Войти"}
        </button>
      </div>
    </header>
  );
}

function BottomNav({page,setPage,cartCount,onCartOpen}:any) {
  const items=[{id:"home",icon:"Home",l:"Главная"},{id:"menu",icon:"UtensilsCrossed",l:"Меню"},{id:"cart",icon:"ShoppingCart",l:"Корзина",cart:true},{id:"recommendations",icon:"Star",l:"Для вас"},{id:"profile",icon:"User",l:"Профиль"}];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{background:"rgba(10,10,10,0.98)",borderTop:"1px solid #1E1E1E",backdropFilter:"blur(20px)"}}>
      <div className="flex">
        {items.map(item=>(
          <button key={item.id} onClick={()=>item.cart?onCartOpen():setPage(item.id)}
            className="flex-1 flex flex-col items-center py-3 gap-1"
            style={{background:"none",border:"none",cursor:"pointer",color:(!item.cart&&page===item.id)?"#C9A84C":"#444"}}>
            <div style={{position:"relative" as const}}>
              <Icon name={item.icon} size={20}/>
              {item.cart&&cartCount>0&&<span style={{position:"absolute",top:-6,right:-6,background:"#C9A84C",color:"#0D0D0D",borderRadius:999,width:14,height:14,fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>}
            </div>
            <span style={{fontSize:9,fontWeight:600,letterSpacing:"0.05em"}}>{item.l}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────

function HomePage({setPage}:any) {
  return (
    <div>
      {/* Hero */}
      <section style={{minHeight:"92vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 90% 70% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 65%)"}}/>
        <div className="absolute inset-0" style={{backgroundImage:"linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)",backgroundSize:"50px 50px"}}/>

        <div className="relative z-10 text-center px-6 animate-fade-in">
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginBottom:24}}>
            <div style={{height:1,width:60,background:"linear-gradient(to right,transparent,#C9A84C)"}}/>
            <span style={{fontSize:11,letterSpacing:"0.5em",textTransform:"uppercase" as const,color:"#C9A84C",fontWeight:700}}>Премиум · Быстро · Вкусно</span>
            <div style={{height:1,width:60,background:"linear-gradient(to left,transparent,#C9A84C)"}}/>
          </div>
          <h1 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(64px,13vw,130px)",fontWeight:700,lineHeight:0.88,letterSpacing:"-0.02em",color:"#EDE8DC",marginBottom:4}}>
            Luna<span style={{color:"#C9A84C"}}>King</span>
          </h1>
          <p style={{fontSize:"clamp(13px,1.8vw,17px)",color:"#8A7E6E",marginTop:24,maxWidth:480,margin:"24px auto 0",lineHeight:1.7,fontWeight:300,letterSpacing:"0.02em"}}>
            Королевский вкус каждый день.<br/>Накапливай короны — получай привилегии.
          </p>
          <div style={{display:"flex",flexDirection:"column" as const,gap:12,justifyContent:"center",marginTop:40}} className="sm:flex-row sm:flex-nowrap">
            <button onClick={()=>setPage("menu")}
              style={{background:"linear-gradient(135deg,#C9A84C,#E8C96A)",color:"#0D0D0D",border:"none",borderRadius:8,padding:"16px 44px",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:"0.12em",textTransform:"uppercase" as const}}>
              Смотреть меню
            </button>
            <button onClick={()=>setPage("auth")}
              style={{background:"transparent",color:"#C9A84C",border:"1px solid rgba(201,168,76,0.35)",borderRadius:8,padding:"16px 44px",fontSize:13,fontWeight:600,cursor:"pointer",letterSpacing:"0.12em",textTransform:"uppercase" as const}}>
              Войти
            </button>
          </div>
        </div>
        <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",border:"1px solid rgba(201,168,76,0.07)",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}/>
        <div style={{position:"absolute",width:800,height:800,borderRadius:"50%",border:"1px solid rgba(201,168,76,0.04)",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}/>
      </section>

      {/* Хиты продаж */}
      <section style={{padding:"60px 24px",maxWidth:1100,margin:"0 auto"}}>
        <SectionTitle title="Хиты" accent="продаж"/>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[BURGERS[0],BURGERS[1],PIZZAS[1],SNACKS[2],DESSERTS[0],DESSERTS[1]].map((item,i)=>(
            <MiniCard key={item.id} item={item} delay={i*0.06} onClick={()=>setPage("menu")}/>
          ))}
        </div>
      </section>

      {/* Преимущества */}
      <section style={{padding:"0 24px 80px",maxWidth:1100,margin:"0 auto"}}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {icon:"Crown",t:"Система Корон",d:"Каждые 4 короны = скидка 2% на любую закуску"},
            {icon:"Zap",t:"25 минут",d:"Горячая еда за 25 минут или доставка бесплатно"},
            {icon:"Shield",t:"Только свежее",d:"Ингредиенты высшего сорта от проверенных поставщиков"},
          ].map((f,i)=>(
            <div key={i} className="animate-fade-in" style={{animationDelay:`${i*0.1}s`,background:"#111",border:"1px solid #1E1E1E",borderRadius:16,padding:28}}>
              <div style={{width:48,height:48,background:"rgba(201,168,76,0.1)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
                <Icon name={f.icon} size={22} style={{color:"#C9A84C"}}/>
              </div>
              <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:700,color:"#EDE8DC",marginBottom:8}}>{f.t}</h3>
              <p style={{fontSize:13,color:"#666",lineHeight:1.6}}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MiniCard({item,delay,onClick}:any) {
  return (
    <div className="animate-fade-in" onClick={onClick}
      style={{animationDelay:`${delay}s`,background:"#111",border:"1px solid #1E1E1E",borderRadius:16,overflow:"hidden",cursor:"pointer",transition:"transform 0.2s,box-shadow 0.2s"}}
      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-4px)";(e.currentTarget as HTMLElement).style.boxShadow="0 12px 40px rgba(201,168,76,0.12)";}}
      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="";(e.currentTarget as HTMLElement).style.boxShadow="";}}>
      <div style={{height:160,overflow:"hidden",position:"relative" as const}}>
        <img src={item.image} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        {item.tag&&<span style={{position:"absolute",top:10,left:10,background:"linear-gradient(135deg,#C9A84C,#E8C96A)",color:"#0D0D0D",borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:700}}>{item.tag}</span>}
      </div>
      <div style={{padding:"16px 18px"}}>
        <h4 style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,fontWeight:700,color:"#EDE8DC",marginBottom:2}}>{item.name}</h4>
        <p style={{fontSize:12,color:"#C9A84C",fontWeight:700}}>{item.price} ₽</p>
      </div>
    </div>
  );
}

function SectionTitle({title,accent}:{title:string;accent:string}) {
  return (
    <div style={{marginBottom:32}}>
      <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(32px,5vw,52px)",fontWeight:700,color:"#EDE8DC"}}>
        {title} <span style={{color:"#C9A84C"}}>{accent}</span>
      </h2>
      <div style={{width:56,height:2,background:"linear-gradient(90deg,#C9A84C,transparent)",marginTop:6}}/>
    </div>
  );
}

// ─── MENU PAGE ────────────────────────────────────────────────────────────────

const MENU_TABS = [
  {id:"burgers",label:"🍔 Бургеры"},
  {id:"pizza",label:"🍕 Пицца"},
  {id:"snacks",label:"🍟 Закуски"},
  {id:"desserts",label:"🍰 Десерты"},
  {id:"drinks",label:"🥤 Напитки"},
];

function MenuPage({addToCart}:any) {
  const [tab,setTab]=useState("burgers");
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"40px 24px"}}>
      <SectionTitle title="Наше" accent="Меню"/>
      <div className="flex gap-2 mb-10 flex-wrap">
        {MENU_TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{padding:"10px 22px",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s",
              background:tab===t.id?"linear-gradient(135deg,#C9A84C,#E8C96A)":"#111",
              color:tab===t.id?"#0D0D0D":"#7A7060",
              border:tab===t.id?"none":"1px solid #1E1E1E"}}>
            {t.label}
          </button>
        ))}
      </div>
      {tab==="burgers"  && <FoodGrid items={BURGERS} addToCart={addToCart}/>}
      {tab==="pizza"    && <FoodGrid items={PIZZAS}  addToCart={addToCart}/>}
      {tab==="snacks"   && <FoodGrid items={SNACKS}  addToCart={addToCart}/>}
      {tab==="desserts" && <FoodGrid items={DESSERTS} addToCart={addToCart}/>}
      {tab==="drinks"   && <DrinksGrid addToCart={addToCart}/>}
    </div>
  );
}

// ─── FOOD GRID ────────────────────────────────────────────────────────────────

function FoodGrid({items,addToCart}:{items:MenuItem[];addToCart:any}) {
  const [sizes,setSizes]=useState<Record<string,string>>({});
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item,i)=>{
        const sel=sizes[item.id]||(item.sizes?item.sizes[0].label:null);
        const sObj=item.sizes?item.sizes.find(s=>s.label===sel):null;
        const price=sObj?sObj.price:item.price;
        return (
          <div key={item.id} className="animate-fade-in"
            style={{animationDelay:`${i*0.06}s`,background:"#111",border:"1px solid #1E1E1E",borderRadius:20,overflow:"hidden",transition:"transform 0.2s,box-shadow 0.2s"}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-5px)";(e.currentTarget as HTMLElement).style.boxShadow="0 16px 48px rgba(201,168,76,0.14)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="";(e.currentTarget as HTMLElement).style.boxShadow="";}}>
            <div style={{height:210,overflow:"hidden",position:"relative" as const}}>
              <img src={item.image} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              {item.tag&&<span style={{position:"absolute",top:12,left:12,background:"linear-gradient(135deg,#C9A84C,#E8C96A)",color:"#0D0D0D",borderRadius:6,padding:"4px 12px",fontSize:11,fontWeight:700}}>{item.tag}</span>}
            </div>
            <div style={{padding:24}}>
              <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:700,color:"#EDE8DC",marginBottom:6}}>{item.name}</h3>
              <p style={{fontSize:12,color:"#666",marginBottom:16,lineHeight:1.55}}>{item.description}</p>
              {item.sizes&&(
                <div style={{display:"flex",gap:8,marginBottom:14}}>
                  {item.sizes.map(s=>(
                    <button key={s.label} onClick={()=>setSizes(p=>({...p,[item.id]:s.label}))}
                      style={{padding:"6px 14px",borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.15s",
                        background:sel===s.label?"rgba(201,168,76,0.18)":"transparent",
                        color:sel===s.label?"#C9A84C":"#555",
                        border:sel===s.label?"1px solid #C9A84C":"1px solid #2A2A2A"}}>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:28,fontWeight:700,color:"#C9A84C"}}>{price} ₽</span>
                <button onClick={()=>addToCart({id:item.id,name:item.name+(sel?` (${sel})`:""),price,size:sel||undefined,image:item.image,qty:1})}
                  style={{background:"linear-gradient(135deg,#C9A84C,#E8C96A)",color:"#0D0D0D",border:"none",borderRadius:8,padding:"10px 20px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
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

function DrinksGrid({addToCart}:any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {DRINKS.map((d,i)=>(
        <div key={d.id} className="animate-fade-in"
          style={{animationDelay:`${i*0.05}s`,background:"#111",border:"1px solid #1E1E1E",borderRadius:16,padding:24,transition:"transform 0.2s"}}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-4px)";}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="";}}>
          <div style={{width:56,height:56,borderRadius:14,background:`${d.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:14}}>{d.emoji}</div>
          <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,fontWeight:700,color:"#EDE8DC",marginBottom:4}}>{d.name}</h3>
          <p style={{fontSize:12,color:"#666",marginBottom:16}}>{d.desc}</p>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:24,fontWeight:700,color:"#C9A84C"}}>{d.price} ₽</span>
            <button onClick={()=>addToCart({id:d.id,name:d.name,price:d.price,image:d.emoji,qty:1})}
              style={{background:"linear-gradient(135deg,#C9A84C,#E8C96A)",color:"#0D0D0D",border:"none",borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
              + В корзину
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── RECOMMENDATIONS ──────────────────────────────────────────────────────────

function RecommendationsPage({addToCart}:any) {
  const [tab,setTab]=useState("burgers");
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"40px 24px"}}>
      <SectionTitle title="Реко" accent="мендации"/>
      <p style={{fontSize:14,color:"#666",marginBottom:24}}>Специально подобрано шеф-поваром LunaKing</p>

      <div style={{background:"linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.04))",border:"1px solid rgba(201,168,76,0.25)",borderRadius:16,padding:24,marginBottom:32}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <span style={{fontSize:40}}>👑</span>
          <div>
            <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,fontWeight:700,color:"#C9A84C"}}>Система Корон LunaKing</h3>
            <p style={{fontSize:13,color:"#8A7E6E",marginTop:4}}>Каждые <strong style={{color:"#E8C96A"}}>4 короны</strong> = скидка <strong style={{color:"#E8C96A"}}>2%</strong> на любую закуску. Короны начисляются за каждый заказ автоматически.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {MENU_TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{padding:"9px 20px",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s",
              background:tab===t.id?"linear-gradient(135deg,#C9A84C,#E8C96A)":"#111",
              color:tab===t.id?"#0D0D0D":"#7A7060",
              border:tab===t.id?"none":"1px solid #1E1E1E"}}>
            {t.label}
          </button>
        ))}
      </div>

      {tab==="burgers"  && <FoodGrid items={BURGERS} addToCart={addToCart}/>}
      {tab==="pizza"    && <FoodGrid items={PIZZAS}  addToCart={addToCart}/>}
      {tab==="snacks"   && <FoodGrid items={SNACKS}  addToCart={addToCart}/>}
      {tab==="desserts" && <FoodGrid items={DESSERTS} addToCart={addToCart}/>}
      {tab==="drinks"   && <DrinksGrid addToCart={addToCart}/>}
    </div>
  );
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────

function OrdersPage({currentUser,setPage}:any) {
  const [tooltip,setTooltip]=useState<{city:string;x:number;y:number}|null>(null);

  if(!currentUser) return (
    <div style={{display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",padding:"120px 24px",textAlign:"center" as const}}>
      <span style={{fontSize:60,marginBottom:16}}>👑</span>
      <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:30,color:"#EDE8DC",marginBottom:12}}>Требуется авторизация</h3>
      <p style={{color:"#666",marginBottom:24}}>Войдите, чтобы видеть историю заказов</p>
      <button onClick={()=>setPage("auth")} style={{background:"linear-gradient(135deg,#C9A84C,#E8C96A)",color:"#0D0D0D",border:"none",borderRadius:8,padding:"14px 36px",fontWeight:700,cursor:"pointer"}}>Войти</button>
    </div>
  );

  // Города на карте (координаты в % от размера SVG viewBox 0 0 1000 500)
  const cities=[
    {name:"Москва",x:53,y:36,count:47},
    {name:"СПб",x:48,y:28,count:23},
    {name:"Казань",x:59,y:37,count:12},
    {name:"Екатеринбург",x:67,y:35,count:18},
    {name:"Новосибирск",x:74,y:36,count:9},
    {name:"Владивосток",x:90,y:42,count:5},
    {name:"Сочи",x:52,y:44,count:6},
    {name:"Самара",x:60,y:38,count:8},
    {name:"Лондон",x:31,y:30,count:3},
    {name:"Берлин",x:36,y:30,count:2},
    {name:"Дубай",x:57,y:47,count:4},
    {name:"Нью-Йорк",x:17,y:35,count:2},
    {name:"Токио",x:87,y:38,count:3},
  ];

  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"40px 24px"}}>
      <SectionTitle title="Мои" accent="Заказы"/>

      {/* Настоящая SVG карта мира */}
      <div style={{background:"#0D0D0D",border:"1px solid #1E1E1E",borderRadius:20,padding:28,marginBottom:32,overflow:"hidden"}}>
        <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,color:"#C9A84C",marginBottom:20}}>🗺️ Карта присутствия LunaKing</h3>
        <div style={{position:"relative" as const,width:"100%",aspectRatio:"2/1",borderRadius:12,overflow:"hidden",background:"#070707"}}>
          {/* Используем Leaflet-подобную тайловую карту через img */}
          <svg viewBox="0 0 1000 500" style={{width:"100%",height:"100%"}} preserveAspectRatio="xMidYMid meet">
            {/* Фон океана */}
            <rect width="1000" height="500" fill="#0A0F18"/>
            {/* Сетка координат */}
            {[0,100,200,300,400,500,600,700,800,900].map(x=><line key={x} x1={x} y1={0} x2={x} y2={500} stroke="rgba(201,168,76,0.04)" strokeWidth="1"/>)}
            {[0,100,200,300,400,500].map(y=><line key={y} x1={0} y1={y} x2={1000} y2={y} stroke="rgba(201,168,76,0.04)" strokeWidth="1"/>)}
            {/* Континенты — упрощённые силуэты */}
            {/* Европа */}
            <path d="M300 150 Q320 130 340 135 Q360 120 375 130 Q390 125 400 135 Q410 130 415 140 Q420 135 430 140 Q435 150 425 158 Q430 165 420 170 Q415 180 405 175 Q400 185 390 180 Q380 190 370 185 Q360 195 350 188 Q340 195 330 188 Q320 195 310 185 Q300 180 295 168 Q290 158 300 150Z" fill="#1A2A1A" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5"/>
            {/* Азия */}
            <path d="M430 100 Q480 85 540 90 Q600 80 650 95 Q700 88 740 100 Q780 95 810 110 Q830 120 820 135 Q810 145 800 140 Q790 155 770 150 Q760 165 740 158 Q720 170 700 162 Q680 175 660 168 Q640 178 615 170 Q590 180 565 172 Q540 182 515 175 Q490 185 465 176 Q440 185 425 175 Q415 165 420 152 Q415 140 425 130 Q420 115 430 100Z" fill="#1A2A1A" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5"/>
            {/* Африка */}
            <path d="M340 200 Q360 195 380 200 Q400 195 415 205 Q425 215 420 230 Q425 245 415 260 Q420 275 410 290 Q415 305 405 320 Q410 335 400 345 Q395 355 385 350 Q375 358 365 352 Q355 358 345 350 Q335 342 330 330 Q320 318 325 305 Q315 290 320 275 Q312 260 318 245 Q312 228 320 215 Q328 205 340 200Z" fill="#1A2A1A" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5"/>
            {/* Северная Америка */}
            <path d="M70 100 Q100 88 130 95 Q160 85 185 95 Q210 88 225 100 Q240 95 250 110 Q260 120 250 135 Q255 148 245 158 Q250 170 238 178 Q228 188 215 182 Q202 192 188 185 Q174 193 160 186 Q146 194 132 186 Q118 192 104 184 Q90 188 78 178 Q65 170 62 158 Q55 145 60 132 Q55 118 65 108 Q68 103 70 100Z" fill="#1A2A1A" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5"/>
            {/* Южная Америка */}
            <path d="M175 235 Q195 228 215 235 Q230 230 240 242 Q250 252 245 268 Q250 283 240 298 Q245 312 235 325 Q240 340 228 350 Q218 358 205 352 Q193 360 182 352 Q170 358 160 348 Q150 336 155 322 Q148 308 155 293 Q148 278 155 264 Q150 250 160 240 Q168 233 175 235Z" fill="#1A2A1A" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5"/>
            {/* Австралия */}
            <path d="M760 275 Q785 265 810 270 Q835 265 855 278 Q870 288 865 302 Q870 315 858 325 Q848 335 832 330 Q818 338 802 332 Q787 338 773 330 Q758 322 755 308 Q750 293 758 282 Q760 278 760 275Z" fill="#1A2A1A" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5"/>
            {/* Маркеры городов */}
            {cities.map(city=>(
              <g key={city.name}>
                <circle cx={city.x*10} cy={city.y*5} r={city.count>10?7:5}
                  fill="#C9A84C" fillOpacity={0.85}
                  stroke="#E8C96A" strokeWidth="1"
                  style={{cursor:"pointer",filter:"drop-shadow(0 0 6px rgba(201,168,76,0.6))"}}
                  onMouseEnter={e=>{const r=e.currentTarget.getBoundingClientRect();const pr=(e.currentTarget.closest("svg") as SVGSVGElement)!.getBoundingClientRect();setTooltip({city:`${city.name}: ${city.count} рест.`,x:r.left-pr.left,y:r.top-pr.top});}}
                  onMouseLeave={()=>setTooltip(null)}
                />
                <circle cx={city.x*10} cy={city.y*5} r={city.count>10?11:8}
                  fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1"
                  style={{animation:"pulse-ring 2s ease-out infinite"}}/>
              </g>
            ))}
          </svg>
          {/* Tooltip */}
          {tooltip&&<div style={{position:"absolute" as const,left:tooltip.x,top:tooltip.y-36,background:"#1A1A1A",border:"1px solid #C9A84C",borderRadius:8,padding:"5px 12px",fontSize:12,color:"#EDE8DC",pointerEvents:"none",whiteSpace:"nowrap" as const,zIndex:10}}>{tooltip.city}</div>}
          <div style={{position:"absolute" as const,bottom:12,left:16,fontSize:11,color:"#333"}}>Наведи на точку для деталей</div>
        </div>
        <style>{`@keyframes pulse-ring{0%{opacity:0.8;transform:scale(1);}100%{opacity:0;transform:scale(2);}}`}</style>
      </div>

      {/* История */}
      {currentUser.orders?.length>0?(
        <div style={{display:"flex",flexDirection:"column" as const,gap:16}}>
          {currentUser.orders.map((order:Order)=>(
            <div key={order.id} className="animate-fade-in" style={{background:"#111",border:"1px solid #1E1E1E",borderRadius:16,padding:24}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{display:"flex",gap:16}}>
                  <span style={{fontSize:12,color:"#444"}}>#{order.id}</span>
                  <span style={{fontSize:12,color:"#444"}}>{order.date}</span>
                </div>
                <span style={{background:"rgba(201,168,76,0.12)",color:"#C9A84C",borderRadius:6,padding:"4px 12px",fontSize:12,fontWeight:600}}>{order.status}</span>
              </div>
              <p style={{fontSize:13,color:"#8A7E6E",marginBottom:8}}>{order.items.map((i:CartItem)=>`${i.name} ×${i.qty}`).join(", ")}</p>
              <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:700,color:"#C9A84C"}}>{order.total} ₽</span>
            </div>
          ))}
        </div>
      ):(
        <div style={{textAlign:"center" as const,padding:"64px 0"}}>
          <div style={{fontSize:52,marginBottom:16}}>🛍️</div>
          <p style={{color:"#444",fontSize:16}}>Заказов пока нет. Сделайте первый!</p>
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

function SettingsPage({currentUser,updateUser,notify,setPage}:any) {
  const [cardNumber,setCardNumber]=useState("");
  const [bank,setBank]=useState<"sber"|"tbank"|null>(null);
  const [linking,setLinking]=useState(false);
  const [linked,setLinked]=useState(false);

  useEffect(()=>{if(currentUser?.cardLinked)setLinked(true);},[currentUser]);

  if(!currentUser) return (
    <div style={{display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",padding:"120px 24px"}}>
      <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:30,color:"#EDE8DC",marginBottom:12}}>Требуется авторизация</h3>
      <button onClick={()=>setPage("auth")} style={{background:"linear-gradient(135deg,#C9A84C,#E8C96A)",color:"#0D0D0D",border:"none",borderRadius:8,padding:"14px 36px",fontWeight:700,cursor:"pointer"}}>Войти</button>
    </div>
  );

  const fmt=(v:string)=>{const d=v.replace(/\D/g,"").slice(0,16);return d.replace(/(.{4})/g,"$1 ").trim();};
  const crownsDiscount=Math.floor((currentUser.crowns||0)/4)*2;

  const doLink=()=>{
    if(!bank){notify("Выберите банк");return;}
    if(cardNumber.replace(/\s/g,"").length<16){notify("Введите полный номер карты");return;}
    setLinking(true);
    setTimeout(()=>{
      setLinking(false);setLinked(true);
      updateUser({...currentUser,cardLinked:true,cardNumber,cardBank:bank});
      notify("Карта успешно привязана! 🎉");
    },3000);
  };

  return (
    <div style={{maxWidth:640,margin:"0 auto",padding:"40px 24px"}}>
      <SectionTitle title="Нас" accent="тройки"/>

      {/* Короны */}
      <div style={{background:"linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.04))",border:"1px solid rgba(201,168,76,0.25)",borderRadius:16,padding:24,marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,color:"#C9A84C",marginBottom:4}}>👑 Мои Короны</h3>
            <p style={{fontSize:13,color:"#8A7E6E"}}>Каждые 4 короны = скидка 2% на любую закуску</p>
          </div>
          <div style={{textAlign:"right" as const}}>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:44,fontWeight:700,color:"#C9A84C",lineHeight:1}}>{currentUser.crowns||0}</div>
            <div style={{fontSize:11,color:"#8A7E6E"}}>корон</div>
          </div>
        </div>
        {crownsDiscount>0&&<div style={{marginTop:14,background:"rgba(201,168,76,0.12)",borderRadius:8,padding:"8px 16px",fontSize:13,color:"#C9A84C",fontWeight:600}}>✨ Скидка {crownsDiscount}% на следующую закуску</div>}
      </div>

      {/* Карта */}
      <div style={{background:"#111",border:"1px solid #1E1E1E",borderRadius:16,padding:28}}>
        <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:700,color:"#EDE8DC",marginBottom:20}}>💳 Привязка карты</h3>

        {linked?(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
              <div style={{width:52,height:52,borderRadius:12,background:currentUser.cardBank==="sber"?"rgba(29,185,84,0.15)":"rgba(255,221,45,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>
                {currentUser.cardBank==="sber"?"🏦":"🟡"}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,color:"#EDE8DC",fontSize:15}}>{currentUser.cardBank==="sber"?"Сбербанк":"Т-Банк"}</div>
                <div style={{fontSize:13,color:"#555"}}>•••• •••• •••• {(currentUser.cardNumber||"").replace(/\s/g,"").slice(-4)}</div>
              </div>
              <div style={{background:"rgba(34,197,94,0.12)",color:"#22C55E",borderRadius:6,padding:"4px 12px",fontSize:12,fontWeight:600}}>✓ Привязана</div>
            </div>
            <button onClick={()=>{setLinked(false);updateUser({...currentUser,cardLinked:false,cardNumber:undefined,cardBank:undefined});notify("Карта отвязана");}}
              style={{background:"none",color:"#555",border:"1px solid #2A2A2A",borderRadius:8,padding:"10px",fontSize:13,cursor:"pointer",width:"100%"}}>Отвязать карту</button>
          </div>
        ):linking?(
          <div style={{display:"flex",flexDirection:"column" as const,alignItems:"center",padding:"40px 0"}}>
            <div style={{width:64,height:64,border:"3px solid rgba(201,168,76,0.2)",borderTop:"3px solid #C9A84C",borderRadius:"50%",animation:"spin-s 1s linear infinite",marginBottom:20}}/>
            <p style={{color:"#C9A84C",fontWeight:700,fontSize:16}}>Подождите, идёт привязка карты...</p>
            <p style={{color:"#444",fontSize:13,marginTop:8}}>Несколько секунд</p>
            <style>{`@keyframes spin-s{to{transform:rotate(360deg);}}`}</style>
          </div>
        ):(
          <div>
            <p style={{fontSize:13,color:"#666",marginBottom:20}}>Привяжите карту Сбербанка или Т-Банка для оплаты через NFC</p>
            <div style={{display:"flex",gap:12,marginBottom:20}}>
              {([{id:"sber" as const,label:"Сбербанк",emoji:"🏦",c:"#1DB954"},{id:"tbank" as const,label:"Т-Банк",emoji:"🟡",c:"#FFDD2D"}]).map(b=>(
                <button key={b.id} onClick={()=>setBank(b.id)}
                  style={{flex:1,padding:"16px 12px",borderRadius:12,cursor:"pointer",transition:"all 0.2s",
                    background:bank===b.id?`${b.c}18`:"#0A0A0A",
                    border:`2px solid ${bank===b.id?b.c:"#1E1E1E"}`,
                    color:"#EDE8DC",textAlign:"center" as const}}>
                  <div style={{fontSize:28,marginBottom:6}}>{b.emoji}</div>
                  <div style={{fontSize:13,fontWeight:600}}>{b.label}</div>
                </button>
              ))}
            </div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:11,color:"#666",display:"block",marginBottom:8,letterSpacing:"0.08em",textTransform:"uppercase" as const}}>Номер карты</label>
              <input value={cardNumber} onChange={e=>setCardNumber(fmt(e.target.value))} placeholder="0000 0000 0000 0000" maxLength={19}
                style={{width:"100%",background:"#0A0A0A",border:"1px solid #2A2A2A",borderRadius:10,padding:"14px 16px",fontSize:18,color:"#EDE8DC",letterSpacing:"0.12em",outline:"none",fontFamily:"Montserrat,sans-serif",boxSizing:"border-box" as const}}
                onFocus={e=>{e.target.style.borderColor="#C9A84C";}} onBlur={e=>{e.target.style.borderColor="#2A2A2A";}}/>
            </div>
            <button onClick={doLink}
              style={{width:"100%",background:"linear-gradient(135deg,#C9A84C,#E8C96A)",color:"#0D0D0D",border:"none",borderRadius:10,padding:"16px",fontSize:14,fontWeight:700,cursor:"pointer",letterSpacing:"0.06em"}}>
              Привязать карту
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────

function ProfilePage({currentUser,setPage,onLogout}:any) {
  if(!currentUser) return (
    <div style={{display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",padding:"120px 24px",textAlign:"center" as const}}>
      <span style={{fontSize:64,marginBottom:16}}>👤</span>
      <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:30,color:"#EDE8DC",marginBottom:12}}>Вы не вошли</h3>
      <button onClick={()=>setPage("auth")} style={{background:"linear-gradient(135deg,#C9A84C,#E8C96A)",color:"#0D0D0D",border:"none",borderRadius:8,padding:"14px 36px",fontWeight:700,cursor:"pointer"}}>Войти / Регистрация</button>
    </div>
  );

  return (
    <div style={{maxWidth:480,margin:"0 auto",padding:"40px 24px"}}>
      <SectionTitle title="Мой" accent="Профиль"/>
      <div className="animate-fade-in" style={{background:"#111",border:"1px solid #1E1E1E",borderRadius:20,padding:32,textAlign:"center" as const,marginBottom:16}}>
        <div style={{width:80,height:80,background:"linear-gradient(135deg,#C9A84C,#E8C96A)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 16px"}}>👑</div>
        <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:26,fontWeight:700,color:"#EDE8DC",marginBottom:4}}>{currentUser.name}</h3>
        <p style={{color:"#555",fontSize:14,marginBottom:24}}>{currentUser.email}</p>
        <div style={{display:"flex",justifyContent:"center",gap:40}}>
          {[{v:currentUser.crowns||0,l:"Корон"},{v:(currentUser.orders||[]).length,l:"Заказов"},{v:currentUser.cardLinked?"✓":"—",l:"Карта"}].map((s,i)=>(
            <div key={i} style={{textAlign:"center" as const}}>
              <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:34,fontWeight:700,color:"#C9A84C"}}>{s.v}</div>
              <div style={{fontSize:10,color:"#444",textTransform:"uppercase" as const,letterSpacing:"0.1em"}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column" as const,gap:10}}>
        {[{id:"settings",icon:"Settings",l:"Настройки"},{id:"orders",icon:"Package",l:"Мои заказы"}].map(item=>(
          <button key={item.id} onClick={()=>setPage(item.id)}
            style={{background:"#111",color:"#EDE8DC",border:"1px solid #1E1E1E",borderRadius:12,padding:"16px 24px",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"border-color 0.2s"}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="#C9A84C";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="#1E1E1E";}}>
            <Icon name={item.icon} size={18} style={{color:"#C9A84C"}}/> {item.l}
          </button>
        ))}
        <button onClick={onLogout} style={{background:"none",color:"#444",border:"1px solid #1E1E1E",borderRadius:12,padding:"16px 24px",fontSize:14,cursor:"pointer"}}>Выйти</button>
      </div>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

function AuthPage({onAuth,notify}:any) {
  const [mode,setMode]=useState<"login"|"register">("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [err,setErr]=useState("");

  const submit=()=>{
    setErr("");
    const users=getUsers();
    if(mode==="register"){
      if(!name.trim()){setErr("Введите имя");return;}
      if(!email.includes("@")){setErr("Неверный email");return;}
      if(password.length<6){setErr("Пароль минимум 6 символов");return;}
      if(users.length>=2){setErr("Достигнут лимит аккаунтов (максимум 2)");return;}
      if(users.find(u=>u.email===email)){setErr("Email уже используется");return;}
      const u:User={email,password,name,crowns:0,cardLinked:false,orders:[]};
      saveUsers([...users,u]);onAuth(u);
    } else {
      const u=users.find(u=>u.email===email&&u.password===password);
      if(!u){setErr("Неверный email или пароль");return;}
      onAuth(u);
    }
  };

  const inp=(v:string,sv:any,ph:string,t="text")=>(
    <input value={v} onChange={e=>sv(e.target.value)} placeholder={ph} type={t}
      style={{width:"100%",background:"#0A0A0A",border:"1px solid #2A2A2A",borderRadius:10,padding:"14px 16px",fontSize:15,color:"#EDE8DC",outline:"none",boxSizing:"border-box" as const,fontFamily:"Montserrat,sans-serif"}}
      onFocus={e=>{e.target.style.borderColor="#C9A84C";}} onBlur={e=>{e.target.style.borderColor="#2A2A2A";}}
      onKeyDown={e=>{if(e.key==="Enter")submit();}}/>
  );

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
      <div style={{width:"100%",maxWidth:420}} className="animate-scale-in">
        <div style={{textAlign:"center" as const,marginBottom:40}}>
          <div style={{fontSize:52,marginBottom:12}}>👑</div>
          <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:38,fontWeight:700,color:"#EDE8DC"}}>{mode==="login"?"Вход":"Регистрация"}</h2>
          <p style={{color:"#555",fontSize:13,marginTop:8}}>{mode==="login"?"Добро пожаловать в LunaKing":"Создайте королевский аккаунт"}</p>
        </div>
        <div style={{background:"#111",border:"1px solid #1E1E1E",borderRadius:20,padding:32}}>
          <div style={{display:"flex",flexDirection:"column" as const,gap:16}}>
            {mode==="register"&&<div><label style={{fontSize:11,color:"#666",display:"block",marginBottom:6,letterSpacing:"0.08em",textTransform:"uppercase" as const}}>Имя</label>{inp(name,setName,"Иван Королёв")}</div>}
            <div><label style={{fontSize:11,color:"#666",display:"block",marginBottom:6,letterSpacing:"0.08em",textTransform:"uppercase" as const}}>Email</label>{inp(email,setEmail,"your@email.com","email")}</div>
            <div><label style={{fontSize:11,color:"#666",display:"block",marginBottom:6,letterSpacing:"0.08em",textTransform:"uppercase" as const}}>Пароль</label>{inp(password,setPassword,"••••••••","password")}</div>
          </div>
          {err&&<div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:8,padding:"10px 16px",fontSize:13,color:"#EF4444",marginTop:16}}>{err}</div>}
          <button onClick={submit}
            style={{width:"100%",background:"linear-gradient(135deg,#C9A84C,#E8C96A)",color:"#0D0D0D",border:"none",borderRadius:10,padding:"16px",fontSize:14,fontWeight:700,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase" as const,marginTop:20}}>
            {mode==="login"?"Войти":"Создать аккаунт"}
          </button>
          {mode==="register"&&<p style={{fontSize:12,color:"#444",textAlign:"center" as const,marginTop:14}}>Максимум 2 аккаунта на устройство</p>}
        </div>
        <div style={{textAlign:"center" as const,marginTop:20}}>
          <button onClick={()=>{setMode(mode==="login"?"register":"login");setErr("");}}
            style={{background:"none",border:"none",color:"#C9A84C",fontSize:14,cursor:"pointer"}}>
            {mode==="login"?"Нет аккаунта? Зарегистрироваться":"Уже есть аккаунт? Войти"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CART MODAL ───────────────────────────────────────────────────────────────

function CartModal({cart,total,onClose,onRemove,onOrder}:any) {
  return (
    <div style={{position:"fixed" as const,inset:0,zIndex:50,display:"flex",alignItems:"flex-end",justifyContent:"center",background:"rgba(0,0,0,0.85)",backdropFilter:"blur(10px)"}} onClick={onClose}>
      <div style={{width:"100%",maxWidth:480,background:"#111",border:"1px solid #1E1E1E",borderRadius:"20px 20px 0 0",padding:28,maxHeight:"80vh",overflowY:"auto"}} className="cart-slide" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:28,fontWeight:700,color:"#EDE8DC"}}>🛒 Корзина</h3>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:22,lineHeight:1}}>✕</button>
        </div>
        {cart.length===0?(
          <div style={{textAlign:"center" as const,padding:"60px 0"}}>
            <div style={{fontSize:48,marginBottom:12}}>🛒</div>
            <p style={{color:"#444"}}>Корзина пуста</p>
          </div>
        ):(
          <>
            <div style={{display:"flex",flexDirection:"column" as const,gap:10,marginBottom:24}}>
              {cart.map((item:CartItem)=>(
                <div key={item.id+(item.size||"")} style={{display:"flex",alignItems:"center",gap:12,background:"#0A0A0A",borderRadius:12,padding:14}}>
                  <div style={{fontSize:24,width:36,textAlign:"center" as const}}>{item.image.startsWith("http")?"🍽️":item.image}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:14,color:"#EDE8DC"}}>{item.name}</div>
                    <div style={{fontSize:12,color:"#555"}}>×{item.qty}</div>
                  </div>
                  <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,fontWeight:700,color:"#C9A84C"}}>{item.price*item.qty} ₽</div>
                  <button onClick={()=>onRemove(item.id,item.size)} style={{background:"none",border:"none",color:"#444",cursor:"pointer"}}><Icon name="Trash2" size={15}/></button>
                </div>
              ))}
            </div>
            <div style={{borderTop:"1px solid #1E1E1E",paddingTop:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <span style={{color:"#8A7E6E",fontSize:14}}>Итого</span>
                <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:32,fontWeight:700,color:"#C9A84C"}}>{total} ₽</span>
              </div>
              <button onClick={onOrder}
                style={{width:"100%",background:"linear-gradient(135deg,#C9A84C,#E8C96A)",color:"#0D0D0D",border:"none",borderRadius:12,padding:18,fontSize:15,fontWeight:700,cursor:"pointer"}}>
                📱 Оплатить через NFC
              </button>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes cart-in{from{transform:translateY(100%);}to{transform:translateY(0);}} .cart-slide{animation:cart-in 0.3s ease-out;}`}</style>
    </div>
  );
}

// ─── NFC ──────────────────────────────────────────────────────────────────────

function NFCPage({cart,total,currentUser,updateUser,onDone}:any) {
  const [step,setStep]=useState<"wait"|"processing"|"done">("wait");

  const tap=()=>{
    setStep("processing");
    setTimeout(()=>{
      setStep("done");
      if(currentUser){
        const order:Order={id:Math.random().toString(36).slice(2,8).toUpperCase(),date:new Date().toLocaleDateString("ru-RU"),items:cart,total,status:"Выполнен",city:"Москва"};
        updateUser({...currentUser,crowns:(currentUser.crowns||0)+4,orders:[order,...(currentUser.orders||[])]});
      }
      setTimeout(onDone,2500);
    },3000);
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{textAlign:"center" as const,maxWidth:340}} className="animate-fade-in">
        <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:40,fontWeight:700,color:"#EDE8DC",marginBottom:8}}>Оплата NFC</h2>
        <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:36,fontWeight:700,color:"#C9A84C",marginBottom:48}}>{total} ₽</p>

        {step==="wait"&&(
          <>
            <div onClick={tap} className="animate-pulse-gold" style={{width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,168,76,0.14) 0%,rgba(201,168,76,0.03) 70%)",border:"2px solid rgba(201,168,76,0.35)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 28px",cursor:"pointer",transition:"transform 0.2s"}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1.06)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="";}}>
              <div><div style={{fontSize:54,marginBottom:6}}>📱</div><div style={{fontSize:11,color:"#C9A84C",fontWeight:700,letterSpacing:"0.15em"}}>NFC</div></div>
            </div>
            <p style={{color:"#8A7E6E",fontSize:15,fontWeight:500,marginBottom:8}}>Приложите телефон к терминалу</p>
            <p style={{color:"#333",fontSize:12}}>Или нажмите для симуляции</p>
          </>
        )}
        {step==="processing"&&(
          <div style={{display:"flex",flexDirection:"column" as const,alignItems:"center"}}>
            <div style={{width:180,height:180,borderRadius:"50%",border:"3px solid rgba(201,168,76,0.12)",borderTop:"3px solid #C9A84C",animation:"nfc-sp 1s linear infinite",margin:"0 auto 28px"}}/>
            <p style={{color:"#C9A84C",fontSize:16,fontWeight:700}}>Обработка платежа...</p>
            <style>{`@keyframes nfc-sp{to{transform:rotate(360deg);}}`}</style>
          </div>
        )}
        {step==="done"&&(
          <div style={{display:"flex",flexDirection:"column" as const,alignItems:"center"}} className="animate-scale-in">
            <div style={{width:180,height:180,borderRadius:"50%",background:"rgba(34,197,94,0.08)",border:"2px solid #22C55E",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 28px",fontSize:72}}>✅</div>
            <p style={{color:"#22C55E",fontSize:20,fontWeight:700,marginBottom:8}}>Оплата прошла!</p>
            <p style={{color:"#C9A84C",fontSize:14}}>+4 короны добавлены 👑</p>
          </div>
        )}
      </div>
    </div>
  );
}
