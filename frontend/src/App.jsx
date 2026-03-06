import { useState, useEffect, useRef } from "react";

const F = "'Nunito','Segoe UI',sans-serif";

// ── Initial Data ─────────────────────────────────────────────────────────────

const RANKS_INIT = [
  { id:1, name:"Owner",   color:"#ff4444", prefix:"[Owner]",   permissions:["*"],                     price:0,    players:1  },
  { id:2, name:"Admin",   color:"#ff8800", prefix:"[Admin]",   permissions:["ban","kick","op","fly"],  price:0,    players:2  },
  { id:3, name:"Mod",     color:"#ffdd00", prefix:"[Mod]",     permissions:["ban","kick","mute"],      price:0,    players:4  },
  { id:4, name:"VIP+",    color:"#aa44ff", prefix:"[VIP+]",    permissions:["fly","kit","home"],       price:2500, players:7  },
  { id:5, name:"VIP",     color:"#44aaff", prefix:"[VIP]",     permissions:["kit","home","color"],     price:1000, players:15 },
  { id:6, name:"Member",  color:"#aaaaaa", prefix:"[Member]",  permissions:["home","tpa"],             price:0,    players:89 },
  { id:7, name:"Default", color:"#666666", prefix:"",          permissions:["tpa"],                    price:0,    players:214},
];

const PLAYERS_INIT = [
  { id:1,  name:"CreeperSlayer99", rank:"Owner",   coins:99999, playtime:"847h", status:"online",  ping:12,  banned:false, muted:false, joined:"2021-03-15", ip:"192.168.1.5"  },
  { id:2,  name:"DiamondMiner_X",  rank:"VIP+",    coins:12450, playtime:"312h", status:"online",  ping:28,  banned:false, muted:false, joined:"2022-06-01", ip:"192.168.1.9"  },
  { id:3,  name:"RedstoneWizard",  rank:"VIP",     coins:3820,  playtime:"189h", status:"online",  ping:55,  banned:false, muted:false, joined:"2022-11-20", ip:"192.168.1.14" },
  { id:4,  name:"EnderPearl_Pro",  rank:"Member",  coins:760,   playtime:"44h",  status:"online",  ping:18,  banned:false, muted:false, joined:"2023-08-09", ip:"192.168.1.20" },
  { id:5,  name:"SkyBlazer44",     rank:"Default", coins:120,   playtime:"12h",  status:"offline", ping:0,   banned:false, muted:false, joined:"2024-01-02", ip:"192.168.2.1"  },
  { id:6,  name:"NightOwlGamer",   rank:"Mod",     coins:5500,  playtime:"401h", status:"offline", ping:0,   banned:false, muted:true,  joined:"2021-09-18", ip:"192.168.1.7"  },
  { id:7,  name:"LavaSurfer",      rank:"Default", coins:45,    playtime:"3h",   status:"offline", ping:0,   banned:true,  muted:false, joined:"2024-02-28", ip:"192.168.3.2"  },
  { id:8,  name:"IronGolemFan",    rank:"VIP",     coins:2100,  playtime:"98h",  status:"offline", ping:0,   banned:false, muted:false, joined:"2023-04-11", ip:"192.168.1.33" },
];

const SHOP_ITEMS = [
  { id:1, name:"Fly",          desc:"Access /fly command",         price:500,  category:"Perks",    icon:"🦋" },
  { id:2, name:"Custom Prefix",desc:"Set any chat prefix",         price:800,  category:"Cosmetic", icon:"✏️" },
  { id:3, name:"Kit Diamond",  desc:"/kit diamond every 24h",      price:1200, category:"Kits",     icon:"💎" },
  { id:4, name:"Home x5",      desc:"Set 5 home locations",        price:600,  category:"Perks",    icon:"🏠" },
  { id:5, name:"Nickname",     desc:"Use colored nicknames",       price:400,  category:"Cosmetic", icon:"🏷️" },
  { id:6, name:"Kit God",      desc:"/kit god every 48h",          price:2500, category:"Kits",     icon:"⚡" },
  { id:7, name:"Particle FX",  desc:"Custom particle effects",     price:700,  category:"Cosmetic", icon:"✨" },
  { id:8, name:"VIP Rank",     desc:"Full VIP rank upgrade",       price:1000, category:"Ranks",    icon:"⭐" },
  { id:9, name:"VIP+ Rank",    desc:"Full VIP+ rank upgrade",      price:2500, category:"Ranks",    icon:"💫" },
];

const COIN_TX = [
  { player:"DiamondMiner_X", type:"earn",  amount:500,  reason:"Voting reward",         time:"2m ago"  },
  { player:"RedstoneWizard",  type:"spend", amount:1200, reason:"Purchased Kit Diamond", time:"14m ago" },
  { player:"EnderPearl_Pro",  type:"earn",  amount:100,  reason:"First join bonus",      time:"1h ago"  },
  { player:"IronGolemFan",    type:"earn",  amount:250,  reason:"Playing 1 hour",        time:"2h ago"  },
  { player:"NightOwlGamer",   type:"earn",  amount:1000, reason:"Admin reward",          time:"3h ago"  },
];

const CONSOLE_INIT = [
  "[10:21:01] [Server thread/INFO]: Starting minecraft server version 1.20.4",
  "[10:21:02] [Server thread/INFO]: Loading properties",
  "[10:21:03] [Server thread/INFO]: Default game type: SURVIVAL",
  "[10:21:04] [Server thread/INFO]: Preparing level 'world'",
  "[10:21:05] [Server thread/INFO]: Loaded 312 advancements",
  '[10:21:05] [Server thread/WARN]: [EssentialsX] Enabling EssentialsX v2.21.0',
  "[10:21:06] [Server thread/INFO]: [WorldEdit] Enabling WorldEdit v7.3.1",
  '[10:21:07] [Server thread/INFO]: Done (4.213s)! For help, type "help"',
];

const VERSIONS = ["1.8.9","1.12.2","1.16.5","1.18.2","1.19.4","1.20.1","1.20.4","1.21.1"];

const PLUGINS_INIT = [
  { id:1, name:"EssentialsX",  desc:"Core commands & utilities",       ver:"2.21.0",  installed:true,  size:"1.2 MB", cat:"Utility"     },
  { id:2, name:"WorldEdit",    desc:"In-game map editor tool",         ver:"7.3.1",   installed:true,  size:"3.8 MB", cat:"Building"    },
  { id:3, name:"LuckPerms",    desc:"Advanced permission management",  ver:"5.4.131", installed:false, size:"2.1 MB", cat:"Admin"       },
  { id:4, name:"Vault",        desc:"Economy & permissions API bridge",ver:"1.7.3",   installed:true,  size:"0.3 MB", cat:"API"         },
  { id:5, name:"WorldGuard",   desc:"Protect regions and worlds",      ver:"7.0.9",   installed:false, size:"1.6 MB", cat:"Protection"  },
  { id:6, name:"DiscordSRV",   desc:"Bridge chat to Discord",          ver:"1.27.0",  installed:false, size:"4.2 MB", cat:"Integration" },
  { id:7, name:"CoreProtect",  desc:"Block logging and rollback",      ver:"22.4",    installed:false, size:"0.9 MB", cat:"Admin"       },
  { id:8, name:"Dynmap",       desc:"Live browser map of your world",  ver:"3.7.0",   installed:false, size:"6.1 MB", cat:"Mapping"     },
];

const MODPACKS_LIST = [
  { name:"RLCraft",        version:"2.9.3", loader:"Forge",    mods:120 },
  { name:"All the Mods 9", version:"0.4.2", loader:"Forge",    mods:380 },
  { name:"Enigmatica 9",   version:"0.9.0", loader:"NeoForge", mods:210 },
];

const SUBDOMAINS_INIT = [
  { sub:"survival", full:"survival.mycraft.net", ip:"192.168.1.10:25565", status:"active"  },
  { sub:"creative", full:"creative.mycraft.net", ip:"192.168.1.10:25566", status:"active"  },
  { sub:"skyblock",  full:"skyblock.mycraft.net", ip:"192.168.1.10:25567", status:"pending" },
];

const BACKUPS_INIT = [
  { name:"auto-2024-01-15_02-00", size:"2.4 GB", created:"Today 2:00 AM",     locked:false },
  { name:"auto-2024-01-14_02-00", size:"2.3 GB", created:"Yesterday 2:00 AM", locked:false },
  { name:"manual-pre-update",     size:"2.1 GB", created:"Jan 12, 2024",       locked:true  },
];

// ── Shared Components ─────────────────────────────────────────────────────────

function Badge({ color="gray", children }) {
  const m = {
    green:  {bg:"#052e16",text:"#4ade80",border:"#166534"},
    yellow: {bg:"#422006",text:"#fbbf24",border:"#78350f"},
    blue:   {bg:"#0c1a3a",text:"#60a5fa",border:"#1e3a8a"},
    red:    {bg:"#2d0a0a",text:"#f87171",border:"#7f1d1d"},
    gray:   {bg:"#1a1f2e",text:"#94a3b8",border:"#334155"},
    purple: {bg:"#1e1040",text:"#c084fc",border:"#6b21a8"},
    orange: {bg:"#2d1500",text:"#fb923c",border:"#7c2d12"},
    cyan:   {bg:"#0a2030",text:"#22d3ee",border:"#155e75"},
  };
  const c = m[color]||m.gray;
  return <span style={{padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:700,background:c.bg,color:c.text,border:`1px solid ${c.border}`,letterSpacing:"0.04em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{children}</span>;
}

function Card({children,style={}}){
  return <div style={{background:"#161b2e",border:"1px solid #1e2d45",borderRadius:8,overflow:"hidden",...style}}>{children}</div>;
}

function CardHeader({children,action}){
  return(
    <div style={{padding:"14px 20px",borderBottom:"1px solid #1e2d45",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
      <span style={{fontWeight:700,fontSize:14,color:"#e2e8f0"}}>{children}</span>
      {action&&<div style={{display:"flex",gap:8,alignItems:"center"}}>{action}</div>}
    </div>
  );
}

function Btn({children,variant="primary",onClick,small,disabled,style={}}){
  const v={primary:{background:"#2563eb",color:"white",border:"none"},success:{background:"#16a34a",color:"white",border:"none"},danger:{background:"#dc2626",color:"white",border:"none"},yellow:{background:"#d97706",color:"white",border:"none"},ghost:{background:"transparent",color:"#94a3b8",border:"1px solid #334155"},purple:{background:"#7c3aed",color:"white",border:"none"},cyan:{background:"#0891b2",color:"white",border:"none"}}[variant]||{background:"#2563eb",color:"white",border:"none"};
  return(
    <button onClick={disabled?undefined:onClick} style={{...v,borderRadius:5,cursor:disabled?"not-allowed":"pointer",fontFamily:F,fontWeight:600,fontSize:small?12:13,padding:small?"5px 12px":"8px 16px",opacity:disabled?0.5:1,transition:"opacity 0.15s,filter 0.15s",whiteSpace:"nowrap",...style}}
      onMouseEnter={e=>{if(!disabled)e.currentTarget.style.filter="brightness(1.15)"}}
      onMouseLeave={e=>{e.currentTarget.style.filter="brightness(1)"}}
    >{children}</button>
  );
}

function Input({placeholder,value,onChange,type="text",style={}}){
  return(
    <input type={type} placeholder={placeholder} value={value} onChange={onChange}
      style={{background:"#0d1117",border:"1px solid #1e2d45",borderRadius:5,color:"#e2e8f0",fontFamily:F,fontSize:13,padding:"8px 12px",outline:"none",width:"100%",...style}}
      onFocus={e=>e.target.style.borderColor="#2563eb"}
      onBlur={e=>e.target.style.borderColor="#1e2d45"}
    />
  );
}

function Select({value,onChange,options,style={}}){
  return(
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{background:"#0d1117",border:"1px solid #1e2d45",borderRadius:5,color:"#e2e8f0",fontFamily:F,fontSize:13,padding:"8px 12px",outline:"none",cursor:"pointer",...style}}
    >
      {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
    </select>
  );
}

function ResourceBar({label,used,total,unit,color="#3b82f6"}){
  const pct=Math.min(100,Math.round((used/total)*100));
  const bc=pct>85?"#f87171":pct>65?"#fbbf24":color;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
        <span style={{fontSize:12,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</span>
        <span style={{fontSize:12,color:"#94a3b8"}}>{used}/{total} {unit}</span>
      </div>
      <div style={{height:6,background:"#0d1117",borderRadius:3,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:bc,borderRadius:3,transition:"width 0.6s ease"}}/>
      </div>
      <div style={{textAlign:"right",marginTop:3,fontSize:11,color:bc}}>{pct}%</div>
    </div>
  );
}

function Modal({title,children,onClose,width=500}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}}>
      <div style={{background:"#161b2e",border:"1px solid #1e2d45",borderRadius:10,width:"100%",maxWidth:width,maxHeight:"90vh",overflow:"auto"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #1e2d45",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontWeight:700,fontSize:15,color:"#e2e8f0"}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:18,lineHeight:1}}>✕</button>
        </div>
        <div style={{padding:20}}>{children}</div>
      </div>
    </div>
  );
}

function Toast({msg,type="success",onDone}){
  useEffect(()=>{const t=setTimeout(onDone,2500);return()=>clearTimeout(t);},[]);
  const colors={success:"#16a34a",error:"#dc2626",info:"#2563eb"};
  return(
    <div style={{position:"fixed",bottom:24,right:24,background:colors[type],color:"white",padding:"12px 20px",borderRadius:8,fontWeight:600,fontSize:13,zIndex:2000,boxShadow:"0 4px 20px rgba(0,0,0,0.4)",animation:"slideUp 0.3s ease"}}>
      {msg}
    </div>
  );
}

function RankBadge({rankName,ranks}){
  const r=ranks.find(x=>x.name===rankName)||ranks[ranks.length-1];
  return(
    <span style={{padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:700,color:"white",background:r?.color||"#666",letterSpacing:"0.04em"}}>{rankName}</span>
  );
}

// ── OVERVIEW ─────────────────────────────────────────────────────────────────
function OverviewTab({players}){
  const [cpu,setCpu]=useState(34);
  const [ram,setRam]=useState(3.1);
  const [serverOn,setServerOn]=useState(true);
  const [toast,setToast]=useState(null);

  useEffect(()=>{
    const t=setInterval(()=>{
      setCpu(c=>Math.max(5,Math.min(95,c+(Math.random()-0.5)*10)));
      setRam(r=>Math.max(1.5,Math.min(7.8,r+(Math.random()-0.5)*0.3)));
    },2000);
    return()=>clearInterval(t);
  },[]);

  const online=players.filter(p=>p.status==="online"&&!p.banned);
  const action=(label,fn,variant)=>{fn();setToast({msg:`Server ${label} command sent`,type:"success"});};

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[
          {label:"Status",value:serverOn?"Online":"Offline",sub:"Minecraft 1.20.4",color:serverOn?"#4ade80":"#f87171"},
          {label:"Players Online",value:`${online.length} / 20`,sub:`${players.length} total registered`,color:"#60a5fa"},
          {label:"Uptime",value:"14h 32m",sub:"Since last restart",color:"#a78bfa"},
          {label:"TPS",value:"19.8",sub:"Tick rate — Healthy",color:"#34d399"},
        ].map(s=>(
          <Card key={s.label} style={{padding:18}}>
            <div style={{fontSize:11,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>{s.label}</div>
            <div style={{fontSize:22,fontWeight:800,color:s.color,marginBottom:4}}>{s.value}</div>
            <div style={{fontSize:12,color:"#475569"}}>{s.sub}</div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>Resource Usage</CardHeader>
        <div style={{padding:20,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:24}}>
          <ResourceBar label="CPU" used={cpu.toFixed(0)} total={100} unit="%" color="#3b82f6"/>
          <ResourceBar label="Memory" used={ram.toFixed(1)} total={8} unit="GB" color="#8b5cf6"/>
          <ResourceBar label="Disk" used={12.4} total={50} unit="GB" color="#10b981"/>
        </div>
      </Card>

      <Card>
        <CardHeader>Power Controls</CardHeader>
        <div style={{padding:16,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <Btn variant="success" onClick={()=>action("start",()=>setServerOn(true))}>▶ Start</Btn>
          <Btn variant="danger"  onClick={()=>action("stop", ()=>setServerOn(false))}>⏹ Stop</Btn>
          <Btn variant="yellow"  onClick={()=>{setServerOn(false);setTimeout(()=>setServerOn(true),1000);setToast({msg:"Restarting server…",type:"info"});}}>↺ Restart</Btn>
          <Btn variant="ghost"   onClick={()=>{setServerOn(false);setToast({msg:"Process killed",type:"error"});}}>☠ Kill</Btn>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:serverOn?"#22c55e":"#f87171",display:"inline-block"}}/>
            <span style={{fontSize:13,color:"#64748b"}}>{serverOn?"Server is running":"Server is offline"}</span>
          </div>
        </div>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <CardHeader>Online Players</CardHeader>
          <div style={{maxHeight:200,overflowY:"auto"}}>
            {online.length===0&&<div style={{padding:20,color:"#475569",fontSize:13}}>No players online</div>}
            {online.map(p=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderBottom:"1px solid #0f1827"}}>
                <span style={{fontSize:16}}>👤</span>
                <span style={{flex:1,fontWeight:600,fontSize:13,color:"#e2e8f0"}}>{p.name}</span>
                <span style={{fontSize:12,color:p.ping<30?"#4ade80":p.ping<80?"#fbbf24":"#f87171"}}>{p.ping}ms</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>Recent Console</CardHeader>
          <div style={{fontFamily:"'Fira Code',monospace",fontSize:12,padding:14,background:"#0a0f1e",height:200,overflowY:"auto",lineHeight:1.8}}>
            {CONSOLE_INIT.slice(-5).map((l,i)=>(
              <div key={i} style={{color:l.includes("WARN")?"#fbbf24":l.includes("ERROR")?"#f87171":"#7a9cbf"}}>{l}</div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── CONSOLE ───────────────────────────────────────────────────────────────────
function ConsoleTab(){
  const [lines,setLines]=useState(CONSOLE_INIT);
  const [cmd,setCmd]=useState("");
  const ref=useRef(null);
  useEffect(()=>{ref.current?.scrollIntoView({behavior:"smooth"});},[lines]);
  const send=()=>{
    if(!cmd.trim())return;
    const c=cmd;
    setLines(l=>[...l,`> ${c}`]);
    setTimeout(()=>setLines(l=>[...l,`[${new Date().toLocaleTimeString()}] [Server thread/INFO]: Unknown command. Type "help" for help.`]),400);
    setCmd("");
  };
  return(
    <Card>
      <div style={{fontFamily:"'Fira Code',monospace",fontSize:12.5,padding:16,background:"#060c19",height:420,overflowY:"auto",lineHeight:1.8}}>
        {lines.map((l,i)=>(
          <div key={i} style={{color:l.includes("WARN")?"#fbbf24":l.includes("ERROR")?"#f87171":l.startsWith(">")?"#60a5fa":"#7a9cbf"}}>{l}</div>
        ))}
        <div ref={ref}/>
      </div>
      <div style={{padding:"12px 16px",borderTop:"1px solid #1e2d45",display:"flex",gap:8}}>
        <span style={{color:"#334155",fontFamily:"monospace",padding:"8px 4px",fontSize:14}}>$</span>
        <Input placeholder="Enter command…" value={cmd} onChange={e=>setCmd(e.target.value)} style={{flex:1}} />
        <Btn onClick={send}>Send</Btn>
      </div>
    </Card>
  );
}

// ── RANKS ─────────────────────────────────────────────────────────────────────
function RanksTab({ranks,setRanks,players,setPlayers}){
  const [editing,setEditing]=useState(null);
  const [adding,setAdding]=useState(false);
  const [toast,setToast]=useState(null);
  const [newRank,setNewRank]=useState({name:"",color:"#ffffff",prefix:"",price:0,permissions:""});

  const saveNew=()=>{
    if(!newRank.name.trim())return;
    setRanks(r=>[...r,{id:Date.now(),name:newRank.name,color:newRank.color,prefix:newRank.prefix,price:Number(newRank.price),permissions:newRank.permissions.split(",").map(s=>s.trim()).filter(Boolean),players:0}]);
    setAdding(false);
    setNewRank({name:"",color:"#ffffff",prefix:"",price:0,permissions:""});
    setToast({msg:"Rank created!",type:"success"});
  };

  const saveEdit=()=>{
    setRanks(r=>r.map(x=>x.id===editing.id?editing:x));
    setEditing(null);
    setToast({msg:"Rank updated!",type:"success"});
  };

  const deleteRank=(id)=>{
    const r=ranks.find(x=>x.id===id);
    if(["Owner","Default"].includes(r?.name))return;
    setRanks(rs=>rs.filter(x=>x.id!==id));
    setToast({msg:"Rank deleted",type:"error"});
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}

      {editing&&(
        <Modal title={`Edit Rank: ${editing.name}`} onClose={()=>setEditing(null)}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div><label style={{fontSize:12,color:"#64748b",fontWeight:600,display:"block",marginBottom:6}}>RANK NAME</label><Input value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})}/></div>
            <div><label style={{fontSize:12,color:"#64748b",fontWeight:600,display:"block",marginBottom:6}}>CHAT PREFIX</label><Input value={editing.prefix} onChange={e=>setEditing({...editing,prefix:e.target.value})}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={{fontSize:12,color:"#64748b",fontWeight:600,display:"block",marginBottom:6}}>COLOR</label>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <input type="color" value={editing.color} onChange={e=>setEditing({...editing,color:e.target.value})} style={{width:40,height:34,background:"none",border:"1px solid #1e2d45",borderRadius:4,cursor:"pointer"}}/>
                  <Input value={editing.color} onChange={e=>setEditing({...editing,color:e.target.value})}/>
                </div>
              </div>
              <div><label style={{fontSize:12,color:"#64748b",fontWeight:600,display:"block",marginBottom:6}}>SHOP PRICE (coins)</label><Input type="number" value={editing.price} onChange={e=>setEditing({...editing,price:Number(e.target.value)})}/></div>
            </div>
            <div><label style={{fontSize:12,color:"#64748b",fontWeight:600,display:"block",marginBottom:6}}>PERMISSIONS (comma separated)</label><Input value={editing.permissions.join(",")} onChange={e=>setEditing({...editing,permissions:e.target.value.split(",").map(s=>s.trim())})}/></div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn variant="ghost" onClick={()=>setEditing(null)}>Cancel</Btn>
              <Btn variant="success" onClick={saveEdit}>Save Changes</Btn>
            </div>
          </div>
        </Modal>
      )}

      {adding&&(
        <Modal title="Create New Rank" onClose={()=>setAdding(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div><label style={{fontSize:12,color:"#64748b",fontWeight:600,display:"block",marginBottom:6}}>RANK NAME</label><Input placeholder="e.g. Legend" value={newRank.name} onChange={e=>setNewRank({...newRank,name:e.target.value})}/></div>
            <div><label style={{fontSize:12,color:"#64748b",fontWeight:600,display:"block",marginBottom:6}}>CHAT PREFIX</label><Input placeholder="[Legend]" value={newRank.prefix} onChange={e=>setNewRank({...newRank,prefix:e.target.value})}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={{fontSize:12,color:"#64748b",fontWeight:600,display:"block",marginBottom:6}}>COLOR</label>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <input type="color" value={newRank.color} onChange={e=>setNewRank({...newRank,color:e.target.value})} style={{width:40,height:34,background:"none",border:"1px solid #1e2d45",borderRadius:4,cursor:"pointer"}}/>
                  <Input value={newRank.color} onChange={e=>setNewRank({...newRank,color:e.target.value})}/>
                </div>
              </div>
              <div><label style={{fontSize:12,color:"#64748b",fontWeight:600,display:"block",marginBottom:6}}>SHOP PRICE (coins)</label><Input type="number" value={newRank.price} onChange={e=>setNewRank({...newRank,price:e.target.value})}/></div>
            </div>
            <div><label style={{fontSize:12,color:"#64748b",fontWeight:600,display:"block",marginBottom:6}}>PERMISSIONS (comma separated)</label><Input placeholder="fly, kit, home" value={newRank.permissions} onChange={e=>setNewRank({...newRank,permissions:e.target.value})}/></div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn variant="ghost" onClick={()=>setAdding(false)}>Cancel</Btn>
              <Btn variant="success" onClick={saveNew}>Create Rank</Btn>
            </div>
          </div>
        </Modal>
      )}

      <Card>
        <CardHeader action={<Btn small onClick={()=>setAdding(true)}>+ New Rank</Btn>}>Rank Manager</CardHeader>
        <div>
          {ranks.map((r,idx)=>(
            <div key={r.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px",borderBottom:"1px solid #0f1827",transition:"background 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#1a2236"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <div style={{width:4,height:40,borderRadius:2,background:r.color,flexShrink:0}}/>
              <div style={{width:80}}>
                <span style={{padding:"3px 10px",borderRadius:4,fontSize:12,fontWeight:800,color:"white",background:r.color}}>{r.name}</span>
              </div>
              <div style={{width:100,fontFamily:"monospace",fontSize:12,color:"#64748b"}}>{r.prefix||<span style={{color:"#2a3a4a"}}>no prefix</span>}</div>
              <div style={{flex:1,display:"flex",flexWrap:"wrap",gap:4}}>
                {r.permissions.slice(0,4).map(p=><span key={p} style={{padding:"1px 6px",background:"#0d1117",border:"1px solid #1e2d45",borderRadius:3,fontSize:11,color:"#60a5fa"}}>{p}</span>)}
                {r.permissions.length>4&&<span style={{fontSize:11,color:"#475569"}}>+{r.permissions.length-4} more</span>}
              </div>
              <div style={{fontSize:13,color:"#64748b",width:80,textAlign:"right"}}>{r.players} players</div>
              {r.price>0&&<div style={{fontSize:12,color:"#fbbf24",width:70,textAlign:"right"}}>🪙 {r.price.toLocaleString()}</div>}
              <div style={{display:"flex",gap:6}}>
                <Btn small variant="ghost" onClick={()=>setEditing({...r})}>Edit</Btn>
                {!["Owner","Default"].includes(r.name)&&<Btn small variant="danger" onClick={()=>deleteRank(r.id)}>Delete</Btn>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>Rank Distribution</CardHeader>
        <div style={{padding:20,display:"flex",gap:8,flexWrap:"wrap"}}>
          {ranks.map(r=>(
            <div key={r.id} style={{flex:1,minWidth:100,background:"#0d1117",border:"1px solid #1e2d45",borderRadius:8,padding:"12px 14px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:800,color:r.color}}>{r.players}</div>
              <div style={{fontSize:11,color:"#475569",marginTop:4}}>{r.name}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── COINS ─────────────────────────────────────────────────────────────────────
function CoinsTab({players,setPlayers}){
  const [search,setSearch]=useState("");
  const [giveModal,setGiveModal]=useState(null);
  const [giveAmt,setGiveAmt]=useState("");
  const [giveReason,setGiveReason]=useState("");
  const [tx,setTx]=useState(COIN_TX);
  const [toast,setToast]=useState(null);
  const [shopItems]=useState(SHOP_ITEMS);

  const filtered=players.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));

  const giveCoins=()=>{
    const amt=Number(giveAmt);
    if(!amt||amt<=0)return;
    setPlayers(ps=>ps.map(p=>p.id===giveModal.id?{...p,coins:p.coins+amt}:p));
    setTx(t=>[{player:giveModal.name,type:"earn",amount:amt,reason:giveReason||"Admin reward",time:"just now"},...t.slice(0,19)]);
    setToast({msg:`Gave 🪙 ${amt.toLocaleString()} to ${giveModal.name}`,type:"success"});
    setGiveModal(null);setGiveAmt("");setGiveReason("");
  };

  const takeCoins=(p,amt)=>{
    setPlayers(ps=>ps.map(x=>x.id===p.id?{...x,coins:Math.max(0,x.coins-amt)}:x));
    setTx(t=>[{player:p.name,type:"spend",amount:amt,reason:"Admin deduction",time:"just now"},...t.slice(0,19)]);
    setToast({msg:`Removed 🪙 ${amt} from ${p.name}`,type:"error"});
  };

  const totalCoins=players.reduce((a,p)=>a+p.coins,0);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      {giveModal&&(
        <Modal title={`Give Coins to ${giveModal.name}`} onClose={()=>setGiveModal(null)} width={420}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:"#0d1117",borderRadius:8,padding:14,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:24}}>🪙</span>
              <div>
                <div style={{fontWeight:700,color:"#e2e8f0"}}>{giveModal.name}</div>
                <div style={{fontSize:12,color:"#64748b"}}>Current balance: {giveModal.coins.toLocaleString()} coins</div>
              </div>
            </div>
            <div><label style={{fontSize:12,color:"#64748b",fontWeight:600,display:"block",marginBottom:6}}>AMOUNT</label><Input type="number" placeholder="500" value={giveAmt} onChange={e=>setGiveAmt(e.target.value)}/></div>
            <div><label style={{fontSize:12,color:"#64748b",fontWeight:600,display:"block",marginBottom:6}}>REASON (optional)</label><Input placeholder="Admin reward, event prize…" value={giveReason} onChange={e=>setGiveReason(e.target.value)}/></div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn variant="ghost" onClick={()=>setGiveModal(null)}>Cancel</Btn>
              <Btn variant="success" onClick={giveCoins}>Give Coins 🪙</Btn>
            </div>
          </div>
        </Modal>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {[
          {label:"Total Coins in Economy",value:`🪙 ${totalCoins.toLocaleString()}`,color:"#fbbf24"},
          {label:"Richest Player",value:players.sort((a,b)=>b.coins-a.coins)[0]?.name||"—",color:"#60a5fa"},
          {label:"Shop Items",value:shopItems.length,color:"#a78bfa"},
        ].map(s=>(
          <Card key={s.label} style={{padding:18}}>
            <div style={{fontSize:11,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>{s.label}</div>
            <div style={{fontSize:20,fontWeight:800,color:s.color}}>{s.value}</div>
          </Card>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <CardHeader action={<Input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} style={{width:160}}/>}>
            Player Balances
          </CardHeader>
          <div style={{maxHeight:320,overflowY:"auto"}}>
            {filtered.sort((a,b)=>b.coins-a.coins).map(p=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 16px",borderBottom:"1px solid #0f1827",transition:"background 0.1s"}}
                onMouseEnter={e=>e.currentTarget.style.background="#1a2236"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >
                <span style={{fontSize:15}}>👤</span>
                <span style={{flex:1,fontWeight:600,fontSize:13,color:"#e2e8f0"}}>{p.name}</span>
                <span style={{fontWeight:700,color:"#fbbf24",fontSize:13}}>🪙 {p.coins.toLocaleString()}</span>
                <Btn small variant="success" onClick={()=>setGiveModal(p)}>Give</Btn>
                <Btn small variant="danger" onClick={()=>takeCoins(p,100)}>-100</Btn>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>Recent Transactions</CardHeader>
          <div style={{maxHeight:320,overflowY:"auto"}}>
            {tx.map((t,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderBottom:"1px solid #0f1827"}}>
                <span style={{fontSize:18}}>{t.type==="earn"?"⬆":"⬇"}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{t.player}</div>
                  <div style={{fontSize:11,color:"#475569"}}>{t.reason}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:13,fontWeight:700,color:t.type==="earn"?"#4ade80":"#f87171"}}>{t.type==="earn"?"+":"-"}🪙{t.amount.toLocaleString()}</div>
                  <div style={{fontSize:11,color:"#334155"}}>{t.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>Coin Shop Items</CardHeader>
        <div style={{padding:20,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
          {shopItems.map(item=>(
            <div key={item.id} style={{background:"#0d1117",border:"1px solid #1e2d45",borderRadius:8,padding:16}}>
              <div style={{fontSize:28,marginBottom:8}}>{item.icon}</div>
              <div style={{fontWeight:700,fontSize:14,color:"#e2e8f0",marginBottom:4}}>{item.name}</div>
              <div style={{fontSize:12,color:"#475569",marginBottom:10}}>{item.desc}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontWeight:800,color:"#fbbf24",fontSize:14}}>🪙 {item.price.toLocaleString()}</span>
                <Badge color="gray">{item.category}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── ADMIN GUI ─────────────────────────────────────────────────────────────────
function AdminTab({players,setPlayers,ranks}){
  const [sel,setSel]=useState(null);
  const [search,setSearch]=useState("");
  const [banModal,setBanModal]=useState(null);
  const [banReason,setBanReason]=useState("");
  const [giveRank,setGiveRank]=useState("");
  const [giveCoinsAmt,setGiveCoinsAmt]=useState("");
  const [toast,setToast]=useState(null);
  const [broadcastMsg,setBroadcastMsg]=useState("");
  const [filter,setFilter]=useState("all");

  const show=(msg,type="success")=>setToast({msg,type});

  const filteredPlayers=players.filter(p=>{
    const q=p.name.toLowerCase().includes(search.toLowerCase());
    if(filter==="online") return q&&p.status==="online";
    if(filter==="banned") return q&&p.banned;
    if(filter==="op")     return q&&(p.rank==="Owner"||p.rank==="Admin"||p.rank==="Mod");
    return q;
  });

  const toggleBan=(p)=>{
    if(!p.banned){setBanModal(p);return;}
    setPlayers(ps=>ps.map(x=>x.id===p.id?{...x,banned:false}:x));
    if(sel?.id===p.id)setSel({...p,banned:false});
    show(`${p.name} unbanned`,"success");
  };

  const confirmBan=()=>{
    setPlayers(ps=>ps.map(x=>x.id===banModal.id?{...x,banned:true,status:"offline"}:x));
    if(sel?.id===banModal.id)setSel({...banModal,banned:true,status:"offline"});
    show(`${banModal.name} has been banned`,"error");
    setBanModal(null);setBanReason("");
  };

  const toggleMute=(p)=>{
    setPlayers(ps=>ps.map(x=>x.id===p.id?{...x,muted:!x.muted}:x));
    if(sel?.id===p.id)setSel({...p,muted:!p.muted});
    show(`${p.name} ${p.muted?"unmuted":"muted"}`,p.muted?"success":"yellow");
  };

  const toggleOp=(p)=>{
    setPlayers(ps=>ps.map(x=>x.id===p.id?{...x,rank:x.rank==="Admin"?"Member":"Admin"}:x));
    if(sel?.id===p.id)setSel({...p,rank:p.rank==="Admin"?"Member":"Admin"});
    show(`${p.name} ${p.rank==="Admin"?"de-opped":"opped"}`,p.rank==="Admin"?"error":"success");
  };

  const applyRank=()=>{
    if(!giveRank||!sel)return;
    setPlayers(ps=>ps.map(x=>x.id===sel.id?{...x,rank:giveRank}:x));
    setSel({...sel,rank:giveRank});
    show(`Set ${sel.name}'s rank to ${giveRank}`);
    setGiveRank("");
  };

  const applyCoins=()=>{
    const amt=Number(giveCoinsAmt);
    if(!amt||!sel)return;
    setPlayers(ps=>ps.map(x=>x.id===sel.id?{...x,coins:Math.max(0,x.coins+amt)}:x));
    setSel(s=>({...s,coins:Math.max(0,s.coins+amt)}));
    show(`${amt>0?"+":""} 🪙${amt.toLocaleString()} to ${sel.name}`);
    setGiveCoinsAmt("");
  };

  const kick=(p)=>{
    setPlayers(ps=>ps.map(x=>x.id===p.id?{...x,status:"offline"}:x));
    if(sel?.id===p.id)setSel({...p,status:"offline"});
    show(`${p.name} was kicked`,"error");
  };

  const broadcast=()=>{
    if(!broadcastMsg.trim())return;
    show(`Broadcast sent to all players`,"success");
    setBroadcastMsg("");
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      {banModal&&(
        <Modal title={`Ban ${banModal.name}`} onClose={()=>setBanModal(null)} width={400}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:"#2d0a0a",border:"1px solid #7f1d1d",borderRadius:8,padding:14,fontSize:13,color:"#fca5a5"}}>
              ⚠ This will immediately disconnect {banModal.name} and prevent them from joining.
            </div>
            <div><label style={{fontSize:12,color:"#64748b",fontWeight:600,display:"block",marginBottom:6}}>BAN REASON</label><Input placeholder="Cheating, griefing, toxicity…" value={banReason} onChange={e=>setBanReason(e.target.value)}/></div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn variant="ghost" onClick={()=>setBanModal(null)}>Cancel</Btn>
              <Btn variant="danger" onClick={confirmBan}>Confirm Ban</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Broadcast */}
      <Card>
        <CardHeader>📢 Broadcast Message</CardHeader>
        <div style={{padding:16,display:"flex",gap:8}}>
          <Input placeholder="Send a message to all online players…" value={broadcastMsg} onChange={e=>setBroadcastMsg(e.target.value)} style={{flex:1}}/>
          <Btn variant="cyan" onClick={broadcast}>Broadcast</Btn>
        </div>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:16}}>
        {/* Player list */}
        <Card>
          <CardHeader action={
            <div style={{display:"flex",gap:8}}>
              <Input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} style={{width:160}}/>
              <Select value={filter} onChange={setFilter} options={[{value:"all",label:"All Players"},{value:"online",label:"Online"},{value:"banned",label:"Banned"},{value:"op",label:"Staff"}]}/>
            </div>
          }>Players ({filteredPlayers.length})</CardHeader>
          <div style={{maxHeight:480,overflowY:"auto"}}>
            {filteredPlayers.map(p=>(
              <div key={p.id}
                onClick={()=>setSel(p)}
                style={{display:"flex",alignItems:"center",gap:12,padding:"11px 16px",borderBottom:"1px solid #0f1827",cursor:"pointer",background:sel?.id===p.id?"#1a2744":"transparent",transition:"background 0.1s",borderLeft:`3px solid ${sel?.id===p.id?"#2563eb":"transparent"}`}}
                onMouseEnter={e=>{ if(sel?.id!==p.id) e.currentTarget.style.background="#111827"; }}
                onMouseLeave={e=>{ if(sel?.id!==p.id) e.currentTarget.style.background="transparent"; }}
              >
                <div style={{position:"relative"}}>
                  <span style={{fontSize:18}}>👤</span>
                  <span style={{position:"absolute",bottom:-2,right:-2,width:8,height:8,borderRadius:"50%",background:p.banned?"#7f1d1d":p.status==="online"?"#22c55e":"#475569",border:"2px solid #161b2e",display:"block"}}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                    <span style={{fontWeight:700,fontSize:13,color:p.banned?"#f87171":"#e2e8f0",textDecoration:p.banned?"line-through":"none"}}>{p.name}</span>
                    {p.muted&&<Badge color="yellow">Muted</Badge>}
                    {p.banned&&<Badge color="red">Banned</Badge>}
                  </div>
                  <div style={{fontSize:11,color:"#475569"}}>{p.rank} · 🪙{p.coins.toLocaleString()} · {p.playtime}</div>
                </div>
                <div style={{width:10,height:10,borderRadius:2,background:ranks.find(r=>r.name===p.rank)?.color||"#666",flexShrink:0}}/>
              </div>
            ))}
          </div>
        </Card>

        {/* Player detail panel */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {sel ? (
            <>
              <Card style={{padding:20}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                  <div style={{width:48,height:48,borderRadius:8,background:"#0d1117",border:"1px solid #1e2d45",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>👤</div>
                  <div>
                    <div style={{fontWeight:800,fontSize:16,color:"#e2e8f0"}}>{sel.name}</div>
                    <div style={{fontSize:12,color:"#475569"}}>{sel.ip}</div>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[
                    {label:"Rank",value:<RankBadge rankName={sel.rank} ranks={ranks}/>},
                    {label:"Coins",value:<span style={{color:"#fbbf24",fontWeight:700}}>🪙 {sel.coins.toLocaleString()}</span>},
                    {label:"Playtime",value:sel.playtime},
                    {label:"Status",value:<Badge color={sel.banned?"red":sel.status==="online"?"green":"gray"}>{sel.banned?"Banned":sel.status}</Badge>},
                    {label:"Joined",value:sel.joined},
                    {label:"Ping",value:sel.status==="online"?`${sel.ping}ms`:"—"},
                  ].map(row=>(
                    <div key={row.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid #0f1827"}}>
                      <span style={{fontSize:12,color:"#64748b",fontWeight:600}}>{row.label}</span>
                      <span style={{fontSize:13,color:"#e2e8f0"}}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card style={{padding:16}}>
                <div style={{fontSize:12,color:"#64748b",fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em"}}>Change Rank</div>
                <div style={{display:"flex",gap:8}}>
                  <Select value={giveRank||sel.rank} onChange={setGiveRank} options={ranks.map(r=>({value:r.name,label:r.name}))} style={{flex:1}}/>
                  <Btn small variant="purple" onClick={applyRank}>Set</Btn>
                </div>
              </Card>

              <Card style={{padding:16}}>
                <div style={{fontSize:12,color:"#64748b",fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em"}}>Coins (+ to add, - to remove)</div>
                <div style={{display:"flex",gap:8}}>
                  <Input type="number" placeholder="+500 or -200" value={giveCoinsAmt} onChange={e=>setGiveCoinsAmt(e.target.value)} style={{flex:1}}/>
                  <Btn small variant="yellow" onClick={applyCoins}>Apply</Btn>
                </div>
              </Card>

              <Card style={{padding:16}}>
                <div style={{fontSize:12,color:"#64748b",fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em"}}>Actions</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {sel.status==="online"&&<Btn small variant="yellow" onClick={()=>kick(sel)}>Kick</Btn>}
                  <Btn small variant={sel.muted?"success":"yellow"} onClick={()=>toggleMute(sel)}>{sel.muted?"Unmute":"Mute"}</Btn>
                  <Btn small variant={sel.banned?"success":"danger"} onClick={()=>toggleBan(sel)}>{sel.banned?"Unban":"Ban"}</Btn>
                  <Btn small variant={sel.rank==="Admin"?"danger":"cyan"} onClick={()=>toggleOp(sel)}>{sel.rank==="Admin"?"De-OP":"OP"}</Btn>
                </div>
              </Card>
            </>
          ) : (
            <Card style={{padding:40,textAlign:"center"}}>
              <div style={{fontSize:36,marginBottom:12}}>👤</div>
              <div style={{color:"#475569",fontSize:13}}>Select a player to manage</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ── VERSIONS ──────────────────────────────────────────────────────────────────
function VersionsTab(){
  const [current,setCurrent]=useState("1.20.4");
  const [selected,setSelected]=useState("1.20.4");
  const [loading,setLoading]=useState(false);
  const [progress,setProgress]=useState(0);
  const [serverType,setServerType]=useState("Paper");
  const [toast,setToast]=useState(null);

  const apply=()=>{
    if(selected===current||loading)return;
    setLoading(true);setProgress(0);
    let p=0;
    const t=setInterval(()=>{
      p+=Math.random()*12;
      if(p>=100){p=100;clearInterval(t);setTimeout(()=>{setCurrent(selected);setLoading(false);setToast({msg:`Switched to Minecraft ${selected}`,type:"success"});},500);}
      setProgress(Math.min(100,p));
    },200);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <Card>
        <CardHeader>Current Version</CardHeader>
        <div style={{padding:20,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <div style={{fontSize:30,fontWeight:800,color:"#60a5fa",fontFamily:"monospace"}}>{current}</div>
          <Badge color="green">Running</Badge>
          <span style={{color:"#475569",fontSize:13}}>Server type: {serverType}</span>
        </div>
      </Card>
      <Card>
        <CardHeader>Select Version</CardHeader>
        <div style={{padding:20}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
            {VERSIONS.map(v=>(
              <button key={v} onClick={()=>setSelected(v)} style={{padding:"8px 20px",borderRadius:6,cursor:"pointer",fontFamily:F,fontWeight:700,fontSize:13,transition:"all 0.15s",background:selected===v?"#1e3a8a":"#0d1117",border:selected===v?"1px solid #3b82f6":"1px solid #1e2d45",color:selected===v?"#93c5fd":"#64748b"}}>{v}</button>
            ))}
          </div>
          {loading?(
            <div style={{background:"#0d1117",borderRadius:8,padding:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:13,color:"#94a3b8"}}>Downloading Minecraft {selected}…</span>
                <span style={{fontSize:13,color:"#3b82f6",fontWeight:700}}>{progress.toFixed(0)}%</span>
              </div>
              <div style={{height:8,background:"#1a2236",borderRadius:4}}>
                <div style={{height:"100%",width:`${progress}%`,background:"#2563eb",borderRadius:4,transition:"width 0.2s"}}/>
              </div>
              <div style={{fontSize:12,color:"#475569",marginTop:8}}>{progress<30?"⬇ Downloading server jar…":progress<70?"📦 Extracting files…":"⚙ Applying configuration…"}</div>
            </div>
          ):(
            <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
              <Btn onClick={apply} variant={selected===current?"ghost":"primary"} disabled={selected===current}>{selected===current?"✓ Already Installed":`Switch to ${selected}`}</Btn>
              {selected!==current&&<span style={{fontSize:12,color:"#fbbf24"}}>⚠ Server will restart to apply changes</span>}
            </div>
          )}
        </div>
      </Card>
      <Card>
        <CardHeader>Server Software</CardHeader>
        <div style={{padding:20,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {[{name:"Vanilla",icon:"🌿",desc:"Official Mojang"},{name:"Paper",icon:"📄",desc:"High performance"},{name:"Spigot",icon:"🔧",desc:"Plugin support"},{name:"Fabric",icon:"🧵",desc:"Mod loader"}].map(t=>(
            <button key={t.name} onClick={()=>setServerType(t.name)} style={{padding:"16px 10px",borderRadius:8,cursor:"pointer",textAlign:"center",background:serverType===t.name?"#1e3a8a":"#0d1117",border:serverType===t.name?"1px solid #3b82f6":"1px solid #1e2d45",color:serverType===t.name?"#93c5fd":"#64748b",fontFamily:F,transition:"all 0.15s"}}>
              <div style={{fontSize:24,marginBottom:8}}>{t.icon}</div>
              <div style={{fontWeight:700,fontSize:13,marginBottom:3}}>{t.name}</div>
              <div style={{fontSize:11,opacity:0.7}}>{t.desc}</div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── PLUGINS ───────────────────────────────────────────────────────────────────
function PluginsTab(){
  const [plugins,setPlugins]=useState(PLUGINS_INIT);
  const [search,setSearch]=useState("");
  const [toast,setToast]=useState(null);
  const toggle=id=>{
    setPlugins(p=>p.map(x=>{
      if(x.id!==id)return x;
      const n={...x,installed:!x.installed};
      setToast({msg:`${n.name} ${n.installed?"installed":"removed"}`,type:n.installed?"success":"error"});
      return n;
    }));
  };
  const filtered=plugins.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.desc.toLowerCase().includes(search.toLowerCase()));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <Card>
        <CardHeader action={<><Input placeholder="Search plugins…" value={search} onChange={e=>setSearch(e.target.value)} style={{width:220}}/><Btn small>⬆ Upload .jar</Btn></>}>Plugin Manager</CardHeader>
        <div>
          {filtered.map(p=>(
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px",borderBottom:"1px solid #0f1827",transition:"background 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#1a2236"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <div style={{width:38,height:38,borderRadius:6,background:"#0d1117",border:"1px solid #1e2d45",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🧩</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <span style={{fontWeight:700,fontSize:14,color:"#e2e8f0"}}>{p.name}</span>
                  <span style={{fontSize:12,color:"#334155"}}>v{p.ver}</span>
                  <Badge color={p.cat==="Admin"?"blue":p.cat==="Protection"?"yellow":"gray"}>{p.cat}</Badge>
                </div>
                <div style={{fontSize:13,color:"#475569"}}>{p.desc}</div>
              </div>
              <span style={{fontSize:12,color:"#334155",marginRight:4}}>{p.size}</span>
              {p.installed?<><Badge color="green">Active</Badge><Btn small variant="danger" onClick={()=>toggle(p.id)}>Remove</Btn></>:<Btn small variant="success" onClick={()=>toggle(p.id)}>Install</Btn>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── MODPACKS ──────────────────────────────────────────────────────────────────
function ModpacksTab(){
  const [url,setUrl]=useState("");
  const [installing,setInstalling]=useState(null);
  const [progress,setProgress]=useState(0);
  const [toast,setToast]=useState(null);
  const start=name=>{
    setInstalling(name);setProgress(0);
    let p=0;
    const t=setInterval(()=>{
      p+=Math.random()*10;
      if(p>=100){clearInterval(t);setInstalling(null);setToast({msg:`${name} installed!`,type:"success"});}
      setProgress(Math.min(100,p));
    },250);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <Card>
        <CardHeader>Install from URL</CardHeader>
        <div style={{padding:20}}>
          <p style={{fontSize:13,color:"#64748b",marginBottom:12}}>Paste a CurseForge or Modrinth modpack link — we'll download and configure everything automatically.</p>
          <div style={{display:"flex",gap:8}}>
            <Input placeholder="https://www.curseforge.com/minecraft/modpacks/…" value={url} onChange={e=>setUrl(e.target.value)}/>
            <Btn onClick={()=>{if(url){start("Custom Modpack");setUrl("");}}}>Install</Btn>
          </div>
        </div>
      </Card>
      {installing&&(
        <Card style={{padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:13,color:"#94a3b8"}}>Installing <strong style={{color:"#e2e8f0"}}>{installing}</strong>…</span>
            <span style={{fontSize:13,color:"#3b82f6",fontWeight:700}}>{progress.toFixed(0)}%</span>
          </div>
          <div style={{height:8,background:"#0d1117",borderRadius:4}}>
            <div style={{height:"100%",width:`${progress}%`,background:"#2563eb",borderRadius:4,transition:"width 0.25s"}}/>
          </div>
          <div style={{fontSize:12,color:"#475569",marginTop:8}}>{progress<40?"⬇ Downloading mods…":progress<80?"📦 Extracting modpack…":"✅ Finalizing…"}</div>
        </Card>
      )}
      <Card>
        <CardHeader>Featured Modpacks</CardHeader>
        <div style={{padding:20,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
          {MODPACKS_LIST.map(m=>(
            <div key={m.name} style={{background:"#0d1117",border:"1px solid #1e2d45",borderRadius:8,padding:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{fontWeight:700,fontSize:15,color:"#e2e8f0",marginBottom:4}}>{m.name}</div>
                  <div style={{fontSize:12,color:"#475569"}}>v{m.version} · {m.mods} mods</div>
                </div>
                <Badge color="purple">{m.loader}</Badge>
              </div>
              <Btn small onClick={()=>start(m.name)}>Install Pack</Btn>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── PLAYERS TAB ───────────────────────────────────────────────────────────────
function PlayersTab({players,ranks}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Card>
        <CardHeader action={<Badge color="green">{players.filter(p=>p.status==="online"&&!p.banned).length} Online</Badge>}>Online Players</CardHeader>
        <div>
          {players.filter(p=>p.status==="online"&&!p.banned).map(p=>(
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 20px",borderBottom:"1px solid #0f1827"}}>
              <div style={{width:36,height:36,borderRadius:4,background:"#0d1117",border:"1px solid #1e2d45",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>👤</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <span style={{fontWeight:700,fontSize:14,color:"#e2e8f0"}}>{p.name}</span>
                  <RankBadge rankName={p.rank} ranks={ranks}/>
                </div>
                <div style={{fontSize:12,color:"#475569"}}>Session: {p.playtime} · 🪙{p.coins.toLocaleString()}</div>
              </div>
              <div style={{fontSize:12,textAlign:"center",marginRight:8}}>
                <div style={{fontWeight:700,color:p.ping<30?"#4ade80":p.ping<80?"#fbbf24":"#f87171"}}>{p.ping}ms</div>
                <div style={{color:"#475569"}}>ping</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[{l:"Total Registered",v:players.length},{l:"Online Now",v:players.filter(p=>p.status==="online").length},{l:"Banned",v:players.filter(p=>p.banned).length},{l:"Total Coins",v:"🪙"+players.reduce((a,p)=>a+p.coins,0).toLocaleString()}].map(s=>(
          <Card key={s.l} style={{padding:18,textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:800,color:"#60a5fa"}}>{s.v}</div>
            <div style={{fontSize:12,color:"#475569",marginTop:6}}>{s.l}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── SUBDOMAINS ─────────────────────────────────────────────────────────────────
function SubdomainsTab(){
  const [domains,setDomains]=useState(SUBDOMAINS_INIT);
  const [newSub,setNewSub]=useState("");
  const [root,setRoot]=useState("mycraft.net");
  const [toast,setToast]=useState(null);
  const add=()=>{
    if(!newSub.trim())return;
    setDomains(d=>[...d,{sub:newSub,full:`${newSub}.${root}`,ip:"192.168.1.10:25568",status:"pending"}]);
    setToast({msg:`${newSub}.${root} created`,type:"success"});
    setNewSub("");
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <Card>
        <CardHeader>Create Subdomain via Cloudflare</CardHeader>
        <div style={{padding:20}}>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:10}}>
            <Input placeholder="subdomain" value={newSub} onChange={e=>setNewSub(e.target.value)} style={{width:160}}/>
            <span style={{color:"#334155",fontSize:16,fontWeight:700}}>.</span>
            <Input value={root} onChange={e=>setRoot(e.target.value)} style={{width:180}}/>
            <Btn onClick={add}>☁ Create Record</Btn>
          </div>
          {newSub&&<div style={{fontSize:12,color:"#475569"}}>Preview: <span style={{color:"#60a5fa"}}>{newSub}.{root}</span></div>}
        </div>
      </Card>
      <Card>
        <CardHeader>Active Records</CardHeader>
        <div>
          {domains.map((d,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px",borderBottom:"1px solid #0f1827"}}>
              <span style={{fontSize:20}}>🌐</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:"#e2e8f0",marginBottom:3}}>{d.full}</div>
                <div style={{fontSize:12,color:"#475569"}}>→ {d.ip}</div>
              </div>
              <Badge color={d.status==="active"?"green":"yellow"}>{d.status}</Badge>
              <Btn small variant="danger" onClick={()=>{setDomains(ds=>ds.filter((_,j)=>j!==i));setToast({msg:"Record deleted",type:"error"});}}>Delete</Btn>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── BACKUPS ───────────────────────────────────────────────────────────────────
function BackupsPage(){
  const [backups,setBackups]=useState(BACKUPS_INIT);
  const [toast,setToast]=useState(null);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <Card>
        <CardHeader action={<Btn small onClick={()=>{setBackups(b=>[{name:`manual-${Date.now()}`,size:"2.5 GB",created:"Just now",locked:false},...b]);setToast({msg:"Backup created!",type:"success"});}}>+ Create Backup</Btn>}>Backups</CardHeader>
        <div>
          {backups.map((b,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px",borderBottom:"1px solid #0f1827"}}>
              <span style={{fontSize:22}}>{b.locked?"🔒":"💾"}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13,color:"#e2e8f0",marginBottom:2}}>{b.name}</div>
                <div style={{fontSize:12,color:"#475569"}}>{b.created} · {b.size}</div>
              </div>
              {b.locked&&<Badge color="yellow">Locked</Badge>}
              <Btn small variant="ghost" onClick={()=>setToast({msg:"Restore started…",type:"info"})}>Restore</Btn>
              {!b.locked&&<Btn small variant="danger" onClick={()=>{setBackups(bs=>bs.filter((_,j)=>j!==i));setToast({msg:"Backup deleted",type:"error"});}}>Delete</Btn>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── DATABASES ─────────────────────────────────────────────────────────────────
function DatabasesPage(){
  const [toast,setToast]=useState(null);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <Card>
        <CardHeader action={<Btn small>+ New Database</Btn>}>Databases</CardHeader>
        <div style={{padding:20}}>
          <div style={{background:"#0d1117",border:"1px solid #1e2d45",borderRadius:8,padding:18,display:"flex",alignItems:"center",gap:14}}>
            <span style={{fontSize:24}}>🗄️</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14,color:"#e2e8f0",marginBottom:4}}>s12_minecraft_main</div>
              <div style={{fontSize:12,color:"#475569"}}>mysql · 127.0.0.1:3306 · 24 MB used</div>
            </div>
            <Btn small onClick={()=>setToast({msg:"Opening phpMyAdmin (SSO)…",type:"info"})}>Open phpMyAdmin ↗</Btn>
            <Btn small variant="ghost" onClick={()=>setToast({msg:"Password copied",type:"success"})}>Copy Password</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── SCHEDULES ─────────────────────────────────────────────────────────────────
function SchedulesPage(){
  const [schedules,setSchedules]=useState([
    {id:1,name:"Daily Auto-Restart",cron:"0 4 * * *",last:"Today 4:00 AM",active:true},
    {id:2,name:"Backup Server",cron:"0 2 * * *",last:"Today 2:00 AM",active:true},
    {id:3,name:"Clear Entity Lag",cron:"*/30 * * * *",last:"14 min ago",active:false},
  ]);
  const [toast,setToast]=useState(null);
  const toggle=id=>{setSchedules(s=>s.map(x=>x.id===id?{...x,active:!x.active}:x));setToast({msg:"Schedule updated",type:"success"});};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <Card>
        <CardHeader action={<Btn small>+ Create Schedule</Btn>}>Schedules</CardHeader>
        <div style={{padding:20,display:"flex",flexDirection:"column",gap:10}}>
          {schedules.map(s=>(
            <div key={s.id} style={{background:"#0d1117",border:"1px solid #1e2d45",borderRadius:8,padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:20}}>⏰</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:"#e2e8f0",marginBottom:3}}>{s.name}</div>
                <div style={{fontSize:12,color:"#475569"}}>Cron: <code style={{color:"#60a5fa"}}>{s.cron}</code> · Last run: {s.last}</div>
              </div>
              <Badge color={s.active?"green":"gray"}>{s.active?"Active":"Disabled"}</Badge>
              <Btn small variant={s.active?"yellow":"success"} onClick={()=>toggle(s.id)}>{s.active?"Disable":"Enable"}</Btn>
              <Btn small variant="danger" onClick={()=>{setSchedules(sc=>sc.filter(x=>x.id!==s.id));setToast({msg:"Schedule deleted",type:"error"});}}>Delete</Btn>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── STARTUP ───────────────────────────────────────────────────────────────────
function StartupPage(){
  const [cmd,setCmd]=useState("java -Xms128M -XX:MaxRAMPercentage=95.0 -jar /home/container/server.jar --nogui");
  const [toast,setToast]=useState(null);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <Card>
        <CardHeader>Startup Configuration</CardHeader>
        <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
          <div>
            <div style={{fontSize:12,color:"#64748b",fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>Startup Command</div>
            <Input value={cmd} onChange={e=>setCmd(e.target.value)}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            {[{label:"Min Memory",val:"128M"},{label:"Max Memory",val:"8192M"},{label:"Server Jar File",val:"server.jar"}].map(f=>(
              <div key={f.label}>
                <div style={{fontSize:12,color:"#64748b",fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>{f.label}</div>
                <Input value={f.val} onChange={()=>{}}/>
              </div>
            ))}
          </div>
          <div><Btn onClick={()=>setToast({msg:"Startup config saved!",type:"success"})}>Save Changes</Btn></div>
        </div>
      </Card>
    </div>
  );
}

// ── NAV CONFIG ────────────────────────────────────────────────────────────────
const NAV_ITEMS=[
  {id:"console",   label:"Console",       icon:"⌨️"},
  {id:"files",     label:"File Manager",  icon:"📁"},
  {id:"databases", label:"Databases",     icon:"🗄️"},
  {id:"schedules", label:"Schedules",     icon:"⏰"},
  {id:"users",     label:"Users",         icon:"👤"},
  {id:"backups",   label:"Backups",       icon:"💾"},
  {id:"network",   label:"Network",       icon:"🌐"},
  {id:"startup",   label:"Startup",       icon:"🚀"},
  {id:"settings",  label:"Settings",      icon:"⚙️"},
  {id:"activity",  label:"Activity Log",  icon:"📋"},
];

const MAIN_TABS=[
  {id:"overview",   label:"Overview"},
  {id:"console",    label:"Console"},
  {id:"versions",   label:"Versions"},
  {id:"plugins",    label:"Plugins"},
  {id:"modpacks",   label:"Modpacks"},
  {id:"players",    label:"Players"},
  {id:"subdomains", label:"Subdomains"},
  {id:"ranks",      label:"Ranks"},
  {id:"coins",      label:"Coins"},
  {id:"admin",      label:"Admin GUI"},
];

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [activeNav,setActiveNav]=useState("console");
  const [activeTab,setActiveTab]=useState("overview");
  const [players,setPlayers]=useState(PLAYERS_INIT);
  const [ranks,setRanks]=useState(RANKS_INIT);

  const renderContent=()=>{
    if(activeNav!=="console"){
      if(activeNav==="backups")   return <BackupsPage/>;
      if(activeNav==="databases") return <DatabasesPage/>;
      if(activeNav==="schedules") return <SchedulesPage/>;
      if(activeNav==="network")   return <SubdomainsTab/>;
      if(activeNav==="startup")   return <StartupPage/>;
      return(
        <Card style={{padding:60,textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:12}}>{NAV_ITEMS.find(n=>n.id===activeNav)?.icon}</div>
          <div style={{fontSize:16,fontWeight:700,color:"#e2e8f0",marginBottom:8}}>{NAV_ITEMS.find(n=>n.id===activeNav)?.label}</div>
          <div style={{fontSize:13,color:"#475569"}}>Available in the full version.</div>
        </Card>
      );
    }
    if(activeTab==="overview")   return <OverviewTab players={players}/>;
    if(activeTab==="console")    return <ConsoleTab/>;
    if(activeTab==="versions")   return <VersionsTab/>;
    if(activeTab==="plugins")    return <PluginsTab/>;
    if(activeTab==="modpacks")   return <ModpacksTab/>;
    if(activeTab==="players")    return <PlayersTab players={players} ranks={ranks}/>;
    if(activeTab==="subdomains") return <SubdomainsTab/>;
    if(activeTab==="ranks")      return <RanksTab ranks={ranks} setRanks={setRanks} players={players} setPlayers={setPlayers}/>;
    if(activeTab==="coins")      return <CoinsTab players={players} setPlayers={setPlayers}/>;
    if(activeTab==="admin")      return <AdminTab players={players} setPlayers={setPlayers} ranks={ranks}/>;
    return null;
  };

  const onlineCount=players.filter(p=>p.status==="online"&&!p.banned).length;

  return(
    <>
      <style>{`
        @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:#0d1117}
        ::-webkit-scrollbar-thumb{background:#1e2d45;border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:#2a3d5a}
      `}</style>
      <div style={{display:"flex",minHeight:"100vh",background:"#0d1117",fontFamily:F,color:"#e2e8f0",fontSize:14}}>

        {/* Sidebar */}
        <div style={{width:220,background:"#0f1827",borderRight:"1px solid #1a2744",display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"18px 16px",borderBottom:"1px solid #1a2744",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:7,background:"linear-gradient(135deg,#15803d,#065f46)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⛏</div>
            <div>
              <div style={{fontWeight:800,fontSize:14,color:"#f1f5f9",letterSpacing:"-0.01em"}}>CraftPanel</div>
              <div style={{fontSize:11,color:"#334155"}}>Minecraft Hosting</div>
            </div>
          </div>

          <div style={{padding:"12px 16px",borderBottom:"1px solid #1a2744",background:"#080f1a"}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",display:"inline-block",flexShrink:0}}/>
              <span style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Survival Server</span>
            </div>
            <div style={{fontSize:11,color:"#334155",marginBottom:1}}>survival.mycraft.net</div>
            <div style={{fontSize:11,color:"#334155"}}>Paper 1.20.4 · {onlineCount}/20 players</div>
          </div>

          <nav style={{flex:1,padding:"8px 0",overflowY:"auto"}}>
            {NAV_ITEMS.map(n=>(
              <div key={n.id} onClick={()=>setActiveNav(n.id)}
                style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:600,color:activeNav===n.id?"#e2e8f0":"#475569",background:activeNav===n.id?"#1a2744":"transparent",borderLeft:`3px solid ${activeNav===n.id?"#2563eb":"transparent"}`,transition:"all 0.12s"}}
                onMouseEnter={e=>{if(activeNav!==n.id){e.currentTarget.style.background="#111827";e.currentTarget.style.color="#94a3b8";}}}
                onMouseLeave={e=>{if(activeNav!==n.id){e.currentTarget.style.background="transparent";e.currentTarget.style.color="#475569";}}}
              >
                <span style={{fontSize:15,flexShrink:0}}>{n.icon}</span>{n.label}
              </div>
            ))}
          </nav>

          <div style={{padding:"12px 16px",borderTop:"1px solid #1a2744",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,borderRadius:6,background:"#1e3a5f",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>👤</div>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>admin</div>
              <div style={{fontSize:11,color:"#334155"}}>Administrator</div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* Top bar */}
          <div style={{minHeight:52,background:"#0f1827",borderBottom:"1px solid #1a2744",display:"flex",alignItems:"center",padding:"0 16px",gap:2,flexShrink:0,overflowX:"auto"}}>
            {activeNav==="console"?(
              MAIN_TABS.map(t=>(
                <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{padding:"6px 14px",borderRadius:5,cursor:"pointer",fontFamily:F,fontWeight:600,fontSize:13,border:"none",transition:"all 0.15s",background:activeTab===t.id?"#1a2744":"transparent",color:activeTab===t.id?"#e2e8f0":"#475569",borderBottom:`2px solid ${activeTab===t.id?"#2563eb":"transparent"}`,whiteSpace:"nowrap",flexShrink:0}}>
                  {t.id==="ranks"?"🏅 "+t.label:t.id==="coins"?"🪙 "+t.label:t.id==="admin"?"🛡 "+t.label:t.label}
                </button>
              ))
            ):(
              <span style={{fontWeight:700,fontSize:14,color:"#e2e8f0",marginLeft:4}}>{NAV_ITEMS.find(n=>n.id===activeNav)?.icon} {NAV_ITEMS.find(n=>n.id===activeNav)?.label}</span>
            )}
            <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center",flexShrink:0,paddingLeft:12}}>
              <div style={{display:"flex",alignItems:"center",gap:7,padding:"5px 12px",background:"#080f1a",borderRadius:5,border:"1px solid #1a2744",whiteSpace:"nowrap"}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",display:"inline-block"}}/>
                <span style={{fontSize:12,color:"#475569"}}>Online · {onlineCount} players</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{flex:1,overflowY:"auto",padding:20,background:"#0d1117"}}>
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}
