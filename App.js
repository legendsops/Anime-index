import { useState, useEffect, useRef } from "react";

const OMDB_KEY = "trilogy";
const uid = () => "_" + Math.random().toString(36).slice(2, 9);
const STORAGE_KEY = "animeIndexDB_v2";

function loadDB() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch {}
  return null;
}
function saveDB(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

const SEED = [
  { id:"s1", title:"A Condition Called Love", year:"2024", genres:["Drama","Romance"], desc:"Hotaru, who has never experienced love, finds herself drawn into a relationship with the popular Hananoi.", rating:"7.8", poster:"", emoji:"💕", channelLink:"https://t.me/Animestation2", channelInfo:"A Condition Called Love — Jap+Eng+Hindi [Eng Sub] • 480p/720p/1080p • @Animestation2", views:120, comments:5, featured:true },
  { id:"s2", title:"7th Time Loop", year:"2024", genres:["Fantasy","Romance"], desc:"Rishe keeps time-looping to the same moment, living different lives — until she meets her fated killer.", rating:"7.5", poster:"", emoji:"🌸", channelLink:"https://t.me/Animestation2", channelInfo:"7th Time Loop — Jap+Eng [Eng Sub] • 480p/720p/1080p • @Animestation2", views:344, comments:4, featured:false },
  { id:"s3", title:"9: Ruler's Crown", year:"2024", genres:["Drama","Mystery"], desc:"A young prince navigates political intrigue and supernatural forces to claim his throne.", rating:"8.1", poster:"", emoji:"👑", channelLink:"https://t.me/Animestation2", channelInfo:"9: Ruler's Crown — Jap+Eng [Eng Sub] • 480p/720p/1080p • @Animestation2", views:272, comments:5, featured:false },
  { id:"s4", title:"Welcome To Demon School! Iruma-kun", year:"2019", genres:["Fantasy","Comedy"], desc:"Fourteen-year-old Iruma Suzuki is sold to a demon and must survive demon school without revealing he's human.", rating:"8.0", poster:"", emoji:"🧙", channelLink:"https://t.me/Animestation2", channelInfo:"Welcome to Demon School — Jap+Eng [Eng Sub] • 480p/720p/1080p • @Animestation2", views:1111, comments:12, featured:false },
  { id:"s5", title:"Spy x Family", year:"2022", genres:["Action","Comedy"], desc:"A spy, an assassin, and a telepath form a fake family — none knowing each other's secret identities.", rating:"8.5", poster:"", emoji:"🕵️", channelLink:"https://t.me/Animestation2", channelInfo:"Spy x Family — Jap+Eng+Hindi [Eng Sub] • 480p/720p/1080p • @Animestation2", views:3210, comments:28, featured:false },
  { id:"s6", title:"Demon Slayer", year:"2019", genres:["Action","Fantasy"], desc:"Tanjiro joins the Demon Slayer Corps after his family is slaughtered and his sister turned into a demon.", rating:"8.7", poster:"", emoji:"⚔️", channelLink:"https://t.me/Animestation2", channelInfo:"Demon Slayer — Jap+Eng+Hindi [Eng Sub] • 480p/720p/1080p • @Animestation2", views:5400, comments:63, featured:false },
];

function gradientFor(id) {
  const g = ["linear-gradient(145deg,#0d1f3c,#1a0a2e)","linear-gradient(145deg,#1a0d2e,#2e140a)","linear-gradient(145deg,#0a2e1a,#0d2e2e)","linear-gradient(145deg,#2e0a1a,#0a1a2e)","linear-gradient(145deg,#0a1a2e,#2a1a00)","linear-gradient(145deg,#1a2e0a,#0a1a2e)"];
  let h = 0; for (const c of String(id)) h = (Math.imul(31,h)+c.charCodeAt(0))|0;
  return g[Math.abs(h)%g.length];
}

function emojiFromGenre(g="") {
  const l = g.toLowerCase();
  if (l.includes("romance")) return "💕";
  if (l.includes("fantasy")||l.includes("adventure")) return "⚔️";
  if (l.includes("horror")||l.includes("thriller")) return "😱";
  if (l.includes("comedy")) return "😄";
  if (l.includes("action")) return "💥";
  if (l.includes("mystery")) return "🔍";
  if (l.includes("drama")) return "🎭";
  if (l.includes("sci-fi")) return "🚀";
  return "🎬";
}

function Toast({ msg, type, visible }) {
  return (
    <div style={{position:"fixed",top:76,right:20,zIndex:9999,background:type==="success"?"rgba(13,25,50,0.97)":"rgba(50,10,18,0.97)",border:`1px solid ${type==="success"?"#4db8ff":"#ff4d6d"}`,color:type==="success"?"#7ef7c8":"#ff4d6d",padding:"11px 20px",borderRadius:12,fontSize:"0.83rem",fontWeight:700,boxShadow:"0 8px 30px rgba(0,0,0,0.6)",transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)",transform:visible?"translateX(0)":"translateX(140%)",opacity:visible?1:0,maxWidth:300}}>
      {msg}
    </div>
  );
}

function Stars({ rating }) {
  const r = parseFloat(rating)||0;
  const filled = Math.round(r/2);
  return (
    <span style={{color:"#ffd566",fontSize:"0.75rem",letterSpacing:1}}>
      {"★".repeat(Math.min(filled,5))}{"☆".repeat(Math.max(5-filled,0))}
      <span style={{color:"#8aabb0",marginLeft:5,fontSize:"0.72rem"}}>{r>0?r+"/10":""}</span>
    </span>
  );
}

function AnimeCard({ anime, onClick, idx }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div onClick={()=>onClick(anime)}
      style={{background:"#0b1325",border:"1px solid rgba(77,184,255,0.13)",borderRadius:16,overflow:"hidden",cursor:"pointer",transition:"all 0.28s",animation:`fadeUp 0.45s ease ${idx*0.06}s both`,position:"relative"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.borderColor="rgba(77,184,255,0.55)";e.currentTarget.style.boxShadow="0 12px 40px rgba(77,184,255,0.18)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor="rgba(77,184,255,0.13)";e.currentTarget.style.boxShadow="none";}}>
      <div style={{position:"relative",height:150,overflow:"hidden"}}>
        {anime.poster&&!imgErr
          ? <img src={anime.poster} alt={anime.title} onError={()=>setImgErr(true)} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.3s"}}/>
          : <div style={{width:"100%",height:"100%",background:gradientFor(anime.id),display:"flex",alignItems:"center",justifyContent:"center",fontSize:"3.2rem"}}>{anime.emoji||"🎬"}</div>
        }
        <div style={{position:"absolute",bottom:7,left:7,display:"flex",gap:4,flexWrap:"wrap"}}>
          {(anime.genres||[]).slice(0,2).map(g=>(
            <span key={g} style={{background:"rgba(6,12,24,0.82)",border:"1px solid rgba(77,184,255,0.35)",color:"#4db8ff",fontSize:"0.58rem",fontWeight:700,letterSpacing:"0.8px",padding:"2px 6px",borderRadius:4}}>{g.toUpperCase()}</span>
          ))}
        </div>
        {anime.rating&&<div style={{position:"absolute",top:7,right:7,background:"rgba(6,12,24,0.85)",border:"1px solid rgba(255,213,102,0.4)",color:"#ffd566",fontSize:"0.68rem",fontWeight:800,padding:"3px 7px",borderRadius:8}}>⭐ {anime.rating}</div>}
        {anime.featured&&<div style={{position:"absolute",top:7,left:7,background:"rgba(77,184,255,0.2)",border:"1px solid rgba(77,184,255,0.5)",color:"#4db8ff",fontSize:"0.58rem",fontWeight:800,padding:"2px 7px",borderRadius:6}}>FEATURED</div>}
      </div>
      <div style={{padding:"11px 12px"}}>
        <div style={{fontWeight:700,fontSize:"0.85rem",color:"white",marginBottom:6,lineHeight:1.3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{anime.title}</div>
        <div style={{display:"flex",gap:10}}>
          <span style={{fontSize:"0.7rem",color:"#5a7a9a"}}>👁 <span style={{color:"#4db8ff",fontWeight:700}}>{anime.views}</span></span>
          <span style={{fontSize:"0.7rem",color:"#5a7a9a"}}>💬 <span style={{color:"#4db8ff",fontWeight:700}}>{anime.comments}</span></span>
          {anime.year&&<span style={{fontSize:"0.7rem",color:"#5a7a9a"}}>{anime.year}</span>}
        </div>
      </div>
    </div>
  );
}

function Modal({ anime, onClose }) {
  const [imgErr, setImgErr] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!anime) return null;
  const copy = () => {
    navigator.clipboard.writeText(anime.channelInfo||anime.title).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),1500);
  };
  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(4,8,18,0.92)",backdropFilter:"blur(12px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#0b1325",border:"1px solid rgba(77,184,255,0.18)",borderRadius:22,maxWidth:420,width:"100%",position:"relative",boxShadow:"0 24px 80px rgba(0,0,0,0.8)",animation:"mIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",overflow:"hidden",maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{position:"relative",height:200,overflow:"hidden",flexShrink:0}}>
          {anime.poster&&!imgErr
            ? <img src={anime.poster} alt={anime.title} onError={()=>setImgErr(true)} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            : <div style={{width:"100%",height:"100%",background:gradientFor(anime.id),display:"flex",alignItems:"center",justifyContent:"center",fontSize:"5rem"}}>{anime.emoji||"🎬"}</div>
          }
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,#0b1325 0%,transparent 55%)"}}/>
          <button onClick={onClose} style={{position:"absolute",top:12,right:12,background:"rgba(4,8,18,0.75)",border:"1px solid rgba(77,184,255,0.2)",color:"#7ab",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:"0.9rem",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>✕</button>
        </div>
        <div style={{padding:"18px 22px 22px"}}>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:"1rem",fontWeight:700,color:"#4db8ff",marginBottom:3}}>{anime.title}</div>
          <div style={{fontSize:"0.78rem",color:"#5a7a9a",marginBottom:10}}>{anime.year} {anime.year&&"•"} <Stars rating={anime.rating}/></div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
            {(anime.genres||[]).map(g=>(
              <span key={g} style={{background:"#111e35",border:"1px solid rgba(77,184,255,0.18)",color:"#d0e8ff",padding:"4px 12px",borderRadius:20,fontSize:"0.77rem",fontWeight:600}}>{g}</span>
            ))}
          </div>
          {anime.desc&&<div style={{background:"#111e35",border:"1px solid rgba(77,184,255,0.12)",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.6rem",letterSpacing:"2px",color:"#4db8ff",marginBottom:7,fontWeight:700}}>SYNOPSIS</div>
            <div style={{fontSize:"0.82rem",color:"#7a9ab5",lineHeight:1.6}}>{anime.desc}</div>
          </div>}
          {anime.channelInfo&&<div style={{background:"#111e35",border:"1px solid rgba(77,184,255,0.12)",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.6rem",letterSpacing:"2px",color:"#4db8ff",marginBottom:7,fontWeight:700}}>CHANNEL INFORMATION</div>
            <div style={{fontSize:"0.82rem",color:"#7a9ab5",lineHeight:1.6}}>{anime.channelInfo}</div>
          </div>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
            {[["VIEWS",anime.views],["COMMENTS",anime.comments],["RATING",anime.rating||"N/A"]].map(([l,v])=>(
              <div key={l} style={{background:"#111e35",border:"1px solid rgba(77,184,255,0.12)",borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
                <div style={{fontSize:"0.58rem",letterSpacing:"1.5px",color:"#5a7a9a",fontWeight:600,marginBottom:3}}>{l}</div>
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:"1.1rem",fontWeight:700,color:l==="RATING"?"#ffd566":"#4db8ff"}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            <button onClick={copy} style={{background:"#111e35",border:"1px solid rgba(77,184,255,0.2)",color:copied?"#7ef7c8":"#d0e8ff",padding:"11px",borderRadius:12,fontWeight:700,fontSize:"0.82rem",cursor:"pointer",transition:"all 0.2s",fontFamily:"inherit"}}>{copied?"✓ COPIED":"COPY INFO"}</button>
            {anime.channelLink
              ? <a href={anime.channelLink} target="_blank" rel="noreferrer" style={{background:"#4db8ff",color:"#060c18",padding:"11px",borderRadius:12,fontWeight:800,fontSize:"0.82rem",cursor:"pointer",textDecoration:"none",textAlign:"center",display:"block",boxShadow:"0 4px 18px rgba(77,184,255,0.35)"}}>JOIN CHANNEL</a>
              : <button style={{background:"#4db8ff",border:"none",color:"#060c18",padding:"11px",borderRadius:12,fontWeight:800,fontSize:"0.82rem",cursor:"pointer",fontFamily:"inherit"}}>JOIN</button>
            }
          </div>
          <div style={{textAlign:"center",marginTop:10,fontSize:"0.68rem",color:"#3a5a7a"}}>Click "Join" to open the channel in Telegram.</div>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ db, setDb, toast }) {
  const [query, setQuery] = useState("");
  const [fetching, setFetching] = useState(false);
  const [form, setForm] = useState({title:"",year:"",genres:"",desc:"",rating:"",poster:"",emoji:"🎬",channelLink:"",channelInfo:""});
  const [preview, setPreview] = useState(null);
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const ADMIN_PASS = "admin123";

  if (!authed) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:400,gap:16}}>
      <div style={{fontFamily:"'Orbitron',monospace",fontSize:"1.2rem",fontWeight:900,color:"#ffd566",letterSpacing:2,marginBottom:8}}>🔐 ADMIN LOGIN</div>
      <input type="password" placeholder="Enter password (admin123)" value={pass} onChange={e=>setPass(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&(pass===ADMIN_PASS?setAuthed(true):toast("Wrong password","error"))}
        style={{background:"#111e35",border:"1px solid rgba(77,184,255,0.25)",color:"#d0e8ff",padding:"12px 18px",borderRadius:12,fontSize:"0.9rem",fontFamily:"inherit",outline:"none",width:280,textAlign:"center"}}/>
      <button onClick={()=>pass===ADMIN_PASS?setAuthed(true):toast("Wrong password","error")}
        style={{background:"#ffd566",border:"none",color:"#111",padding:"11px 32px",borderRadius:12,fontWeight:800,fontSize:"0.9rem",cursor:"pointer",fontFamily:"inherit"}}>LOGIN</button>
      <div style={{fontSize:"0.73rem",color:"#3a5a7a"}}>Demo password: admin123</div>
    </div>
  );

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const fetchOMDB = async () => {
    if (!query.trim()) { toast("Enter a title first","error"); return; }
    setFetching(true);
    try {
      const r = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${OMDB_KEY}&plot=short`);
      const d = await r.json();
      if (d.Response==="True") {
        const genres = (d.Genre||"").split(",").map(g=>g.trim()).filter(Boolean);
        setForm({title:d.Title||"",year:d.Year||"",genres:genres.join(", "),desc:d.Plot!=="N/A"?d.Plot:"",rating:d.imdbRating!=="N/A"?d.imdbRating:"",poster:d.Poster!=="N/A"?d.Poster:"",emoji:emojiFromGenre(d.Genre||""),channelLink:"https://t.me/Animestation2",channelInfo:`${d.Title} Audio - Jap+Eng [Eng Sub] • 480p/720p/1080p • Genres: ${d.Genre} ~ @Animestation2`});
        setPreview(d);
        toast(`✓ Found: ${d.Title}`,"success");
      } else {
        const r2 = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${OMDB_KEY}`);
        const d2 = await r2.json();
        if (d2.Response==="True"&&d2.Search?.length) {
          const f = d2.Search[0];
          setForm(prev=>({...prev,title:f.Title,year:f.Year,poster:f.Poster!=="N/A"?f.Poster:"",emoji:emojiFromGenre("")}));
          setPreview({Title:f.Title,Year:f.Year,Poster:f.Poster,Genre:"—",imdbRating:"—",Plot:"—"});
          toast(`Found: ${f.Title}. Fetch again for full details.`,"success");
        } else toast(`Not found: "${query}"`,"error");
      }
    } catch { toast("Network error. Try again.","error"); }
    setFetching(false);
  };

  const addAnime = () => {
    if (!form.title.trim()) { toast("Title required","error"); return; }
    const genres = form.genres.split(",").map(g=>g.trim()).filter(Boolean);
    const a = {id:uid(),title:form.title.trim(),year:form.year.trim(),genres,desc:form.desc.trim(),rating:form.rating.trim(),poster:form.poster.trim(),emoji:form.emoji||"🎬",channelLink:form.channelLink.trim(),channelInfo:form.channelInfo.trim()||`${form.title} Audio - Jap+Eng [Eng Sub] • 480p/720p/1080p ~ @Animestation2`,views:Math.floor(Math.random()*30)+1,comments:0,featured:db.length===0};
    const newDb = [a,...db];
    setDb(newDb); saveDB(newDb);
    setForm({title:"",year:"",genres:"",desc:"",rating:"",poster:"",emoji:"🎬",channelLink:"",channelInfo:""});
    setQuery(""); setPreview(null);
    toast(`✓ "${a.title}" added!`,"success");
  };

  const delAnime = (id) => {
    const a = db.find(x=>x.id===id);
    const newDb = db.filter(x=>x.id!==id);
    if (newDb.length&&!newDb.some(x=>x.featured)) newDb[0].featured=true;
    setDb(newDb); saveDB(newDb);
    toast(`Removed: "${a?.title}"`,"error");
  };

  const setFeatured = (id) => {
    const newDb = db.map(a=>({...a,featured:a.id===id}));
    setDb(newDb); saveDB(newDb);
    toast("✓ Featured updated!","success");
  };

  const inpStyle = {width:"100%",background:"#0d1a2e",border:"1px solid rgba(77,184,255,0.18)",color:"#d0e8ff",padding:"10px 13px",borderRadius:10,fontSize:"0.85rem",fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  const lbl = (t) => <div style={{fontSize:"0.68rem",fontWeight:700,letterSpacing:"1px",color:"#4a6a8a",marginBottom:5,textTransform:"uppercase"}}>{t}</div>;
  const fg = (ch) => <div style={{marginBottom:12}}>{ch}</div>;

  return (
    <div style={{paddingBottom:40}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
        {[["TOTAL",db.length,"#4db8ff"],["GENRES",new Set(db.flatMap(a=>a.genres||[])).size,"#7ef7c8"],["VIEWS",db.reduce((s,a)=>s+(a.views||0),0),"#ffd566"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#0b1325",border:"1px solid rgba(77,184,255,0.15)",borderRadius:14,padding:16,textAlign:"center"}}>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:"1.6rem",fontWeight:900,color:c}}>{v}</div>
            <div style={{fontSize:"0.63rem",letterSpacing:"1.5px",color:"#4a6a8a",fontWeight:600,marginTop:3}}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={{background:"#0b1325",border:"1px solid rgba(77,184,255,0.15)",borderRadius:18,padding:22}}>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.8rem",letterSpacing:"2px",color:"#4db8ff",marginBottom:18,fontWeight:700}}>➕ ADD NEW ANIME</div>

          {fg(<>
            {lbl("Search by Title (IMDB)")}
            <div style={{display:"flex",gap:8}}>
              <input style={{...inpStyle,flex:1}} value={query} onChange={e=>setQuery(e.target.value)} placeholder="e.g. Naruto, Demon Slayer..." onKeyDown={e=>e.key==="Enter"&&fetchOMDB()}/>
              <button onClick={fetchOMDB} disabled={fetching} style={{background:fetching?"#222":"#ffd566",border:"none",color:"#111",padding:"10px 14px",borderRadius:10,fontWeight:800,fontSize:"0.8rem",cursor:fetching?"not-allowed":"pointer",fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0,opacity:fetching?0.6:1}}>
                {fetching?"⏳...":"🔍 Fetch"}
              </button>
            </div>
          </>)}

          {preview&&<div style={{background:"#111e35",border:"1px solid rgba(255,213,102,0.2)",borderRadius:12,padding:12,marginBottom:14,display:"flex",gap:12,alignItems:"flex-start"}}>
            {preview.Poster&&preview.Poster!=="N/A"
              ? <img src={preview.Poster} alt="" style={{width:56,height:80,objectFit:"cover",borderRadius:7,flexShrink:0,border:"1px solid rgba(77,184,255,0.2)"}}/>
              : <div style={{width:56,height:80,background:"#0d1a2e",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.8rem",flexShrink:0}}>{form.emoji}</div>
            }
            <div>
              <div style={{fontWeight:700,color:"white",fontSize:"0.88rem"}}>{preview.Title}</div>
              <div style={{fontSize:"0.73rem",color:"#5a7a9a",marginTop:3}}>{preview.Year} • {preview.Genre}</div>
              {preview.imdbRating&&preview.imdbRating!=="—"&&<div style={{color:"#ffd566",fontSize:"0.76rem",fontWeight:700,marginTop:4}}>⭐ IMDB: {preview.imdbRating}</div>}
            </div>
          </div>}

          {fg(<>{lbl("Title *")}<input style={inpStyle} value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Anime title"/></>)}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div>{lbl("Year")}<input style={inpStyle} value={form.year} onChange={e=>set("year",e.target.value)} placeholder="2024"/></div>
            <div>{lbl("Rating")}<input style={inpStyle} value={form.rating} onChange={e=>set("rating",e.target.value)} placeholder="8.5"/></div>
          </div>
          {fg(<>{lbl("Genres (comma separated)")}<input style={inpStyle} value={form.genres} onChange={e=>set("genres",e.target.value)} placeholder="Action, Fantasy, Romance"/></>)}
          {fg(<>{lbl("Description")}<textarea style={{...inpStyle,height:70,resize:"vertical"}} value={form.desc} onChange={e=>set("desc",e.target.value)} placeholder="Brief synopsis..."/></>)}
          {fg(<>{lbl("Poster / Image URL")}<input style={inpStyle} value={form.poster} onChange={e=>set("poster",e.target.value)} placeholder="https://... (auto-filled from IMDB)"/></>)}
          {fg(<>{lbl("Telegram Channel Link")}<input style={inpStyle} value={form.channelLink} onChange={e=>set("channelLink",e.target.value)} placeholder="https://t.me/yourchannel"/></>)}
          {fg(<>{lbl("Channel Info Text")}<textarea style={{...inpStyle,height:60,resize:"vertical"}} value={form.channelInfo} onChange={e=>set("channelInfo",e.target.value)} placeholder="Audio info, quality, channel name..."/></>)}
          {fg(<>{lbl("Emoji Icon")}<input style={{...inpStyle,width:80}} value={form.emoji} onChange={e=>set("emoji",e.target.value)} placeholder="🎬" maxLength={4}/></>)}

          <button onClick={addAnime} style={{width:"100%",background:"linear-gradient(135deg,#4db8ff,#2a6db5)",border:"none",color:"white",padding:13,borderRadius:12,fontWeight:800,fontSize:"0.9rem",cursor:"pointer",fontFamily:"inherit",letterSpacing:"1px",boxShadow:"0 6px 22px rgba(77,184,255,0.3)"}}>✦ ADD TO INDEX</button>
        </div>

        <div style={{background:"#0b1325",border:"1px solid rgba(77,184,255,0.15)",borderRadius:18,padding:22}}>
          <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.8rem",letterSpacing:"2px",color:"#4db8ff",marginBottom:16,fontWeight:700}}>📋 MANAGE INDEX ({db.length})</div>
          <div style={{display:"flex",flexDirection:"column",gap:9,maxHeight:600,overflowY:"auto",paddingRight:4}}>
            {db.length===0&&<div style={{textAlign:"center",padding:40,color:"#3a5a7a",fontSize:"0.85rem"}}>No anime added yet.</div>}
            {db.map(a=>(
              <div key={a.id} style={{background:"#111e35",border:"1px solid rgba(77,184,255,0.12)",borderRadius:12,padding:"11px 13px",display:"flex",alignItems:"center",gap:11,transition:"border-color 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(77,184,255,0.3)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(77,184,255,0.12)"}>
                {a.poster
                  ? <img src={a.poster} alt={a.title} style={{width:38,height:54,objectFit:"cover",borderRadius:6,flexShrink:0,border:"1px solid rgba(77,184,255,0.2)"}} onError={e=>{e.target.style.display="none";}}/>
                  : <div style={{width:38,height:54,background:gradientFor(a.id),borderRadius:6,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem"}}>{a.emoji||"🎬"}</div>
                }
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:"0.82rem",color:"white",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.title}</div>
                  <div style={{fontSize:"0.68rem",color:"#4a6a8a",marginTop:2}}>{a.year||"—"} • {(a.genres||[]).join(", ")} • 👁{a.views}</div>
                  {a.channelLink&&<div style={{fontSize:"0.65rem",color:"#4db8ff",marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.channelLink}</div>}
                </div>
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  <button onClick={()=>setFeatured(a.id)} style={{background:a.featured?"rgba(255,213,102,0.2)":"rgba(255,213,102,0.07)",border:`1px solid ${a.featured?"#ffd566":"rgba(255,213,102,0.25)"}`,color:"#ffd566",padding:"5px 9px",borderRadius:8,fontSize:"0.78rem",cursor:"pointer",fontWeight:700}}>★</button>
                  <button onClick={()=>delAnime(a.id)} style={{background:"rgba(255,77,109,0.1)",border:"1px solid rgba(255,77,109,0.28)",color:"#ff4d6d",padding:"5px 9px",borderRadius:8,fontSize:"0.78rem",cursor:"pointer",fontWeight:700}}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [db, setDb] = useState(()=>loadDB()||SEED);
  const [page, setPage] = useState("home");
  const [modal, setModal] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [filterGenre, setFilterGenre] = useState("All");
  const [featIdx, setFeatIdx] = useState(0);
  const [toast, setToastState] = useState({msg:"",type:"",visible:false});
  const toastRef = useRef();

  useEffect(()=>{saveDB(db);},[db]);
  useEffect(()=>{
    const id = setInterval(()=>setFeatIdx(i=>(i+1)%Math.max(db.length,1)),4000);
    return ()=>clearInterval(id);
  },[db.length]);

  const showToast = (msg,type="success") => {
    clearTimeout(toastRef.current);
    setToastState({msg,type,visible:true});
    toastRef.current = setTimeout(()=>setToastState(t=>({...t,visible:false})),3000);
  };

  const openModal = (a) => {
    const newDb = db.map(x=>x.id===a.id?{...x,views:(x.views||0)+1}:x);
    setDb(newDb);
    setModal(newDb.find(x=>x.id===a.id));
  };

  const allGenres = ["All",...Array.from(new Set(db.flatMap(a=>a.genres||[]))).sort()];
  const filtered = db.filter(a=>{
    const mQ = !searchQ||a.title.toLowerCase().includes(searchQ.toLowerCase())||(a.genres||[]).some(g=>g.toLowerCase().includes(searchQ.toLowerCase()));
    const mG = filterGenre==="All"||(a.genres||[]).includes(filterGenre);
    return mQ&&mG;
  });

  const featAnime = db[featIdx%Math.max(db.length,1)];
  const navItems = [{id:"home",icon:"🏠",label:"Home"},{id:"browse",icon:"🔍",label:"Browse"},{id:"new",icon:"✨",label:"New"},{id:"top",icon:"🏆",label:"Top"},{id:"admin",icon:"⚙️",label:"Admin"}];

  const SearchBar = ({id}) => (
    <div style={{position:"relative",marginBottom:14}}>
      <span style={{position:"absolute",left:15,top:"50%",transform:"translateY(-50%)",color:"#4a6a8a",fontSize:"1rem"}}>🔍</span>
      <input id={id} value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search anime by name or genre..."
        style={{width:"100%",background:"#0b1325",border:"1px solid rgba(77,184,255,0.15)",color:"#d0e8ff",padding:"13px 44px",borderRadius:14,fontSize:"0.9rem",fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}
        onFocus={e=>e.target.style.borderColor="#4db8ff"} onBlur={e=>e.target.style.borderColor="rgba(77,184,255,0.15)"}/>
      {searchQ&&<button onClick={()=>setSearchQ("")} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#4a6a8a",fontSize:"1rem",cursor:"pointer"}}>✕</button>}
    </div>
  );

  const GenreFilter = () => (
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:22,paddingBottom:4}}>
      {allGenres.map(g=>(
        <button key={g} onClick={()=>setFilterGenre(g)}
          style={{background:filterGenre===g?"#4db8ff":"#0b1325",border:`1px solid ${filterGenre===g?"#4db8ff":"rgba(77,184,255,0.15)"}`,color:filterGenre===g?"#060c18":"#7a9ab5",padding:"6px 15px",borderRadius:20,fontWeight:700,fontSize:"0.76rem",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",transition:"all 0.2s",flexShrink:0}}>
          {g}
        </button>
      ))}
    </div>
  );

  const Grid = () => (
    filtered.length===0
      ? <div style={{textAlign:"center",padding:"50px 20px",color:"#3a5a7a"}}><div style={{fontSize:"3rem",marginBottom:12}}>🌌</div><p style={{fontSize:"0.9rem"}}>No anime found.</p></div>
      : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:14}}>
          {filtered.map((a,i)=><AnimeCard key={a.id} anime={a} onClick={openModal} idx={i}/>)}
        </div>
  );

  const homeContent = (
    <div>
      {featAnime&&(
        <div onClick={()=>openModal(featAnime)} style={{position:"relative",borderRadius:18,overflow:"hidden",height:300,marginBottom:20,cursor:"pointer",border:"1px solid rgba(77,184,255,0.15)",boxShadow:"0 8px 40px rgba(0,0,0,0.6)",transition:"box-shadow 0.3s"}}
          onMouseEnter={e=>e.currentTarget.style.boxShadow="0 12px 50px rgba(77,184,255,0.2)"}
          onMouseLeave={e=>e.currentTarget.style.boxShadow="0 8px 40px rgba(0,0,0,0.6)"}>
          {featAnime.poster
            ? <img src={featAnime.poster} alt={featAnime.title} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
            : <div style={{position:"absolute",inset:0,background:gradientFor(featAnime.id),display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8rem",opacity:0.2}}>{featAnime.emoji}</div>
          }
          <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(4,8,18,0.97) 0%,rgba(4,8,18,0.65) 55%,transparent 85%)"}}/>
          <div style={{position:"absolute",left:28,bottom:26,maxWidth:440}}>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.58rem",letterSpacing:"3px",color:"#4db8ff",fontWeight:700,marginBottom:7}}>✦ FEATURED ANIME</div>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:"1.5rem",fontWeight:900,color:"white",lineHeight:1.2,marginBottom:8}}>{featAnime.title}</div>
            <div style={{fontSize:"0.8rem",color:"rgba(208,232,255,0.7)",marginBottom:12,lineHeight:1.5,maxWidth:360}}>{(featAnime.desc||"").slice(0,110)}{(featAnime.desc||"").length>110?"...":""}</div>
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              {featAnime.year&&<span style={{background:"rgba(126,247,200,0.1)",border:"1px solid rgba(126,247,200,0.3)",color:"#7ef7c8",padding:"3px 11px",borderRadius:20,fontSize:"0.72rem",fontWeight:600}}>{featAnime.year}</span>}
              <span style={{background:"rgba(77,184,255,0.1)",border:"1px solid rgba(77,184,255,0.3)",color:"#4db8ff",padding:"3px 11px",borderRadius:20,fontSize:"0.72rem",fontWeight:600}}>👁 {featAnime.views} Views</span>
              {featAnime.rating&&<span style={{background:"rgba(255,213,102,0.1)",border:"1px solid rgba(255,213,102,0.3)",color:"#ffd566",padding:"3px 11px",borderRadius:20,fontSize:"0.72rem",fontWeight:600}}>⭐ {featAnime.rating}</span>}
            </div>
            <button style={{display:"inline-flex",alignItems:"center",gap:8,background:"white",color:"#111",padding:"9px 20px",borderRadius:24,fontWeight:800,fontSize:"0.88rem",border:"none",cursor:"pointer",fontFamily:"inherit"}}>▶ Watch</button>
          </div>
        </div>
      )}
      <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:22}}>
        {db.slice(0,Math.min(db.length,9)).map((_,i)=>(
          <div key={i} onClick={()=>setFeatIdx(i)} style={{width:i===featIdx%Math.min(db.length,9)?24:8,height:8,borderRadius:4,background:i===featIdx%Math.min(db.length,9)?"#4db8ff":"rgba(77,184,255,0.2)",cursor:"pointer",transition:"all 0.3s"}}/>
        ))}
      </div>
      <SearchBar id="homeSearch"/>
      <GenreFilter/>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
        <span style={{color:"#4db8ff",fontFamily:"'Orbitron',monospace",fontSize:"1.1rem",fontWeight:900}}>#</span>
        <div style={{flex:1,height:1,background:"linear-gradient(90deg,#4db8ff,transparent)"}}/>
        <span style={{fontFamily:"'Orbitron',monospace",fontSize:"0.6rem",letterSpacing:"3px",color:"#3a5a7a"}}>{searchQ||filterGenre!=="All"?`${filtered.length} RESULTS`:"ALL ANIME"}</span>
      </div>
      <Grid/>
    </div>
  );

  const browseContent = (
    <div>
      <div style={{fontFamily:"'Orbitron',monospace",fontSize:"1.3rem",fontWeight:900,color:"white",letterSpacing:3,marginBottom:6,textAlign:"center",paddingTop:20}}>BROWSE ANIME</div>
      <div style={{textAlign:"center",color:"#4db8ff",marginBottom:24,fontSize:"0.88rem"}}>Explore the full library</div>
      <SearchBar id="browseSearch"/>
      <GenreFilter/>
      <Grid/>
    </div>
  );

  const topContent = (
    <div>
      <div style={{fontFamily:"'Orbitron',monospace",fontSize:"1.3rem",fontWeight:900,color:"white",letterSpacing:3,marginBottom:6,textAlign:"center",paddingTop:20}}>🏆 TOP RATED</div>
      <div style={{textAlign:"center",color:"#ffd566",marginBottom:24,fontSize:"0.88rem"}}>Highest rated anime in the index</div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {[...db].sort((a,b)=>(parseFloat(b.rating)||0)-(parseFloat(a.rating)||0)).map((a,i)=>(
          <div key={a.id} onClick={()=>openModal(a)} style={{background:"#0b1325",border:"1px solid rgba(77,184,255,0.13)",borderRadius:14,padding:"13px 16px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(77,184,255,0.4)";e.currentTarget.style.transform="translateX(4px)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(77,184,255,0.13)";e.currentTarget.style.transform="translateX(0)";}}>
            <div style={{fontFamily:"'Orbitron',monospace",fontSize:"1.4rem",fontWeight:900,color:i<3?"#ffd566":"#3a5a7a",width:32,textAlign:"center",flexShrink:0}}>#{i+1}</div>
            {a.poster
              ? <img src={a.poster} alt="" style={{width:44,height:62,objectFit:"cover",borderRadius:8,flexShrink:0}} onError={e=>e.target.style.display="none"}/>
              : <div style={{width:44,height:62,background:gradientFor(a.id),borderRadius:8,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem"}}>{a.emoji}</div>
            }
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,color:"white",fontSize:"0.9rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.title}</div>
              <div style={{fontSize:"0.73rem",color:"#4a6a8a",marginTop:3}}>{a.year} • {(a.genres||[]).join(", ")}</div>
              <Stars rating={a.rating}/>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{color:"#ffd566",fontFamily:"'Orbitron',monospace",fontSize:"1rem",fontWeight:700}}>{a.rating||"—"}</div>
              <div style={{fontSize:"0.65rem",color:"#4a6a8a",marginTop:2}}>👁 {a.views}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const newContent = (
    <div>
      <div style={{fontFamily:"'Orbitron',monospace",fontSize:"1.3rem",fontWeight:900,color:"white",letterSpacing:3,marginBottom:6,textAlign:"center",paddingTop:20}}>✨ NEW RELEASES</div>
      <div style={{textAlign:"center",color:"#7ef7c8",marginBottom:24,fontSize:"0.88rem"}}>Recently added to the index</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:14}}>
        {[...db].slice(0,12).map((a,i)=><AnimeCard key={a.id} anime={a} onClick={openModal} idx={i}/>)}
      </div>
    </div>
  );

  const pages = {home:homeContent,browse:browseContent,top:topContent,new:newContent};

  return (
    <div style={{background:"#060c18",minHeight:"100vh",fontFamily:"'Nunito','Segoe UI',sans-serif",color:"#d0e8ff",position:"relative",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Nunito:wght@300;400;600;700;800&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
        @keyframes mIn{from{opacity:0;transform:scale(0.85) translateY(20px);}to{opacity:1;transform:scale(1) translateY(0);}}
        *{box-sizing:border-box;}
        *::-webkit-scrollbar{width:4px;height:4px;}
        *::-webkit-scrollbar-track{background:#0b1325;}
        *::-webkit-scrollbar-thumb{background:#4db8ff;border-radius:4px;}
        input::placeholder,textarea::placeholder{color:#3a5a7a!important;}
        body{margin:0;}
      `}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,backgroundImage:"radial-gradient(1px 1px at 8% 15%,rgba(255,255,255,0.3) 0%,transparent 100%),radial-gradient(1px 1px at 35% 55%,rgba(255,255,255,0.2) 0%,transparent 100%),radial-gradient(1px 1px at 65% 10%,rgba(255,255,255,0.25) 0%,transparent 100%),radial-gradient(1px 1px at 82% 75%,rgba(255,255,255,0.18) 0%,transparent 100%),radial-gradient(1px 1px at 22% 88%,rgba(255,255,255,0.22) 0%,transparent 100%)"}}/>
      <header style={{position:"sticky",top:0,zIndex:100,background:"rgba(6,12,24,0.95)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(77,184,255,0.12)",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
        <div style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:"1.05rem",color:"#4db8ff",letterSpacing:"3px",textShadow:"0 0 20px rgba(77,184,255,0.4)",whiteSpace:"nowrap"}}>
          INDEX<span style={{color:"#7ef7c8"}}>STATION</span>
        </div>
        <nav style={{display:"flex",gap:4}}>
          {navItems.map(n=>(
            <button key={n.id} onClick={()=>{setPage(n.id);setSearchQ("");setFilterGenre("All");}}
              style={{background:page===n.id?"rgba(77,184,255,0.12)":"transparent",border:`1px solid ${page===n.id?"rgba(77,184,255,0.3)":"transparent"}`,color:page===n.id?"#4db8ff":"#5a7a9a",padding:"7px 14px",borderRadius:20,fontWeight:700,fontSize:"0.8rem",cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s",display:"flex",alignItems:"center",gap:5}}>
              <span>{n.icon}</span><span>{n.label}</span>
            </button>
          ))}
        </nav>
        <button style={{background:"rgba(255,213,102,0.1)",border:"1px solid rgba(255,213,102,0.3)",color:"#ffd566",padding:"7px 15px",borderRadius:20,fontWeight:700,fontSize:"0.78rem",cursor:"pointer",fontFamily:"inherit"}}>✉ Mail</button>
      </header>
      {page==="admin"&&<div style={{background:"linear-gradient(90deg,rgba(255,213,102,0.06),transparent)",borderBottom:"1px solid rgba(255,213,102,0.1)",padding:"14px 24px",display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontFamily:"'Orbitron',monospace",fontWeight:900,fontSize:"0.9rem",color:"#ffd566",letterSpacing:2}}>⚙ ADMIN PANEL</span>
        <span style={{fontSize:"0.75rem",color:"#6a8a6a"}}>Manage your anime index</span>
      </div>}
      <main style={{position:"relative",zIndex:1,maxWidth:1300,margin:"0 auto",padding:"20px 20px 90px"}}>
        {page==="admin"?<AdminPanel db={db} setDb={setDb} toast={showToast}/>:(pages[page]||homeContent)}
      </main>
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:200,background:"rgba(6,12,24,0.97)",backdropFilter:"blur(16px)",borderTop:"1px solid rgba(77,184,255,0.12)",display:"flex",justifyContent:"space-around",padding:"8px 0 10px"}}>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>{setPage(n.id);setSearchQ("");setFilterGenre("All");}}
            style={{background:"none",border:"none",color:page===n.id?"#4db8ff":"#3a5a7a",cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 10px",transition:"color 0.2s",minWidth:50}}>
            <span style={{fontSize:"1.2rem"}}>{n.icon}</span>
            <span style={{fontSize:"0.58rem",fontWeight:700,letterSpacing:"0.5px",textTransform:"uppercase"}}>{n.label}</span>
            {page===n.id&&<div style={{width:16,height:2,background:"#4db8ff",borderRadius:2}}/>}
          </button>
        ))}
      </div>
      {modal&&<Modal anime={modal} onClose={()=>setModal(null)}/>}
      <Toast msg={toast.msg} type={toast.type} visible={toast.visible}/>
    </div>
  );
}
