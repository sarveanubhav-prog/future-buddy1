import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight, Award, BarChart3, BookOpen, BriefcaseBusiness, Check, ChevronRight,
  CircleHelp, Compass, GraduationCap, House, LayoutDashboard, LogIn, LogOut,
  Menu, Moon, Search, ShieldCheck, Sparkles, Target, TrendingUp, UserRound, X, Zap
} from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from "recharts";
import { CAREERS, CAREER_BY_SLUG, CATEGORIES, formatLPA } from "./data/careers";
import { QUIZ_QUESTIONS, TRAIT_LABELS, matchCareers, scoreQuiz } from "./data/quiz";
import { GOV_CATEGORIES } from "./data/jobs";

const NAV = [
  ["/", "Home"], ["/careers", "Careers"], ["/assessment", "Assessment"],
  ["/salaries", "Salaries"], ["/skills", "Skills"], ["/resources", "Resources"]
];

function useAuth() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("futurebuddy_user") || "null"); }
    catch { return null; }
  });
  return { session: user ? { user } : null, user };
}

function Layout({ children }) {
  const { user } = useAuth();
  const [mobile, setMobile] = useState(false);
  const nav = useNavigate();
  const location = useLocation();

  async function logout() {
    localStorage.removeItem("futurebuddy_user");
    nav("/auth");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="nav-wrap">
          <Link to="/" className="brand">
            <span className="brand-mark"><GraduationCap size={21}/></span>
            <span>Future<span className="brand-accent">Buddy</span></span>
          </Link>
          <nav className="desktop-nav">
            {NAV.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{label}</NavLink>
            ))}
          </nav>
          <div className="nav-actions desktop-nav">
            {user ? <>
              <Link className="icon-btn" to="/dashboard" title="Dashboard"><LayoutDashboard size={18}/></Link>
              <Link className="profile-pill" to="/profile"><UserRound size={16}/> Profile</Link>
              <button className="ghost-btn" onClick={logout}><LogOut size={16}/> Logout</button>
            </> : <Link className="primary-btn small" to="/auth"><LogIn size={16}/> Sign in</Link>}
          </div>
          <button className="mobile-menu" onClick={() => setMobile(!mobile)}>{mobile ? <X/> : <Menu/>}</button>
        </div>
        {mobile && <div className="mobile-nav">
          {NAV.map(([to,label]) => <Link key={to} to={to} onClick={() => setMobile(false)}>{label}</Link>)}
          {user ? <Link to="/dashboard" onClick={() => setMobile(false)}>Dashboard</Link> : <Link to="/auth" onClick={() => setMobile(false)}>Sign in</Link>}
        </div>}
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="container footer-grid">
          <div><div className="brand"><span className="brand-mark"><GraduationCap size={19}/></span><span>Future<span className="brand-accent">Buddy</span></span></div>
          <p>Career intelligence for students — assessment, career discovery, salary insights, roadmaps and verified resources.</p></div>
          <div><b>Explore</b><Link to="/careers">Career Explorer</Link><Link to="/assessment">Assessment</Link><Link to="/salaries">Salaries</Link><Link to="/government-jobs">Government Jobs</Link></div>
          <div><b>Platform</b><Link to="/resources">Resources</Link><Link to="/skills">Skills</Link><Link to="/compare">Compare</Link><Link to="/about">About</Link></div>
          <div><b>Legal</b><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/contact">Contact</Link></div>
        </div>
        <div className="container footer-bottom">© {new Date().getFullYear()} Future Buddy · Engineering final year project</div>
      </footer>
    </div>
  );
}

function Hero() {
  return <section className="hero">
    <div className="hero-glow one"/><div className="hero-glow two"/>
    <div className="container hero-grid">
      <div>
        <div className="eyebrow"><Sparkles size={15}/> CAREER INTELLIGENCE PLATFORM</div>
        <h1>Stop guessing.<br/><span>Start building</span> your future.</h1>
        <p className="hero-copy">Discover careers that match your strengths, compare salary paths, build a roadmap and learn from verified official resources.</p>
        <div className="hero-actions"><Link className="primary-btn large" to="/assessment">Take the 5-min assessment <ArrowRight size={18}/></Link><Link className="secondary-btn large" to="/careers">Explore careers</Link></div>
        <div className="hero-proof"><span><Check size={15}/> 15-question assessment</span><span><Check size={15}/> 45+ career paths</span><span><Check size={15}/> Official resources</span></div>
      </div>
      <div className="hero-panel">
        <div className="panel-top"><span>YOUR CAREER SIGNAL</span><span className="live-dot">● LIVE</span></div>
        <div className="signal-score">87<span>%</span></div>
        <div className="signal-label">Potential match strength</div>
        <div className="mini-bars"><div><span>Analytical</span><i style={{width:"91%"}}/></div><div><span>Problem solving</span><i style={{width:"86%"}}/></div><div><span>Technical</span><i style={{width:"78%"}}/></div><div><span>Communication</span><i style={{width:"72%"}}/></div></div>
        <div className="panel-match"><div className="match-icon"><Zap size={19}/></div><div><b>Software Engineer</b><small>High-demand · ₹4–12 LPA fresher range</small></div><strong>87%</strong></div>
      </div>
    </div>
  </section>;
}

function Home() {
  const stats = [["45+","Career paths"],["15","Assessment questions"],["7","Core traits"],["24","Official resources"]];
  return <><Hero/><section className="container stat-row">{stats.map(([n,t])=><div className="stat" key={t}><b>{n}</b><span>{t}</span></div>)}</section>
  <section className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">HOW IT WORKS</div><h2>One platform. Your complete career picture.</h2></div><Link to="/assessment" className="text-link">Start now <ArrowRight size={16}/></Link></div>
  <div className="feature-grid">{[
    [Target,"Personalized assessment","Measure technical, analytical, communication, creativity, leadership, problem solving and interest."],
    [Compass,"Smart career matches","Get match percentages and clear reasons instead of generic career advice."],
    [TrendingUp,"Salary intelligence","Explore realistic fresher-to-experienced salary bands and growth paths."],
    [BookOpen,"Verified learning","Jump directly to official government, university and documentation resources."],
    [BriefcaseBusiness,"Job pathways","Understand government exam routes and private-sector opportunities side by side."],
    [Award,"Actionable roadmap","Turn your strongest match into a practical learning-to-job roadmap."]
  ].map(([Icon,title,text])=><div className="feature-card" key={title}><div className="feature-icon"><Icon size={21}/></div><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>
  <section className="dark-section"><div className="container split"><div><div className="eyebrow light">BUILT FOR STUDENTS</div><h2>Your next step should be clear.</h2><p>Future Buddy connects assessment data with real career information so you can move from “What should I do?” to “What should I do next?”</p><Link to="/assessment" className="white-btn">Find my path <ArrowRight size={17}/></Link></div><div className="roadmap-preview">{["Know yourself","Match careers","Learn skills","Build proof","Apply & grow"].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,"0")}</span><b>{x}</b><ChevronRight size={17}/></div>)}</div></div></section></>;
}

function PageHead({eyebrow="EXPLORE", title, text}) { return <div className="page-head"><div className="container"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{text}</p></div></div>; }

function CareerCard({c, score}) { return <div className="career-card"><div className="career-top"><span className="tag">{c.category}</span>{score != null && <b className="score">{score}% match</b>}</div><h3>{c.name}</h3><p>{c.overview}</p><div className="career-meta"><span><GraduationCap size={15}/>{c.education}</span><span><TrendingUp size={15}/>Fresher: {c.salary?.[0] ? formatLPA(c.salary[0].min,c.salary[0].max) : "—"}</span><span><BarChart3 size={15}/>{c.demand} demand · {c.difficulty}</span></div><Link className="text-link" to={`/careers/${c.slug}`}>View career <ArrowRight size={16}/></Link></div>; }

function Careers() {
  const [q,setQ]=useState(""); const [cat,setCat]=useState("All");
  const list=useMemo(()=>CAREERS.filter(c=>(cat==="All"||c.category===cat)&&(c.name.toLowerCase().includes(q.toLowerCase())||c.overview.toLowerCase().includes(q.toLowerCase()))),[q,cat]);
  return <><PageHead eyebrow="CAREER EXPLORER" title="Find a career that fits you." text="Browse the full career library by domain, demand, education and salary potential."/>
  <section className="container section"><div className="toolbar"><div className="search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search careers..."/></div><select value={cat} onChange={e=>setCat(e.target.value)}><option>All</option>{CATEGORIES.map(x=><option key={x}>{x}</option>)}</select></div><div className="career-grid">{list.map(c=><CareerCard key={c.slug} c={c}/>)}</div></section></>;
}

function CareerDetail() {
  const {slug}=useParams(); const c=CAREER_BY_SLUG[slug];
  if(!c) return <NotFound/>;
  return <><PageHead eyebrow={c.category} title={c.name} text={c.overview}/><section className="container detail-grid section">
    <div><div className="detail-card"><h2>Career snapshot</h2><div className="facts"><span><b>Sector</b>{c.sector}</span><span><b>Demand</b>{c.demand}</span><span><b>Difficulty</b>{c.difficulty}</span><span><b>Education</b>{c.education}</span><span><b>Work type</b>{c.workType}</span><span><b>Eligibility</b>{c.eligibility}</span></div></div>
    <div className="detail-card"><h2>Skills to build</h2><div className="chips">{c.skills.map(s=><span key={s}>{s}</span>)}</div><h3>Roadmap</h3><ol className="roadmap-list">{c.roadmap.map((s,i)=><li key={s}><span>{i+1}</span>{s}</li>)}</ol></div></div>
    <aside><div className="detail-card sticky"><h2>Salary path</h2>{c.salary.map(s=><div className="salary-line" key={s.label}><span>{s.label}</span><b>{formatLPA(s.min,s.max)}</b></div>)}<Link className="primary-btn full" to="/assessment">Check my match</Link></div></aside>
  </section></>;
}

function Assessment() {
  const {user}=useAuth(); const nav=useNavigate(); const [i,setI]=useState(0); const [answers,setAnswers]=useState([]); const [result,setResult]=useState(null); const [saving,setSaving]=useState(false);
  const q=QUIZ_QUESTIONS[i];
  function choose(v){const a=[...answers];a[i]=Number(v);setAnswers(a);}
  async function finish(a){const scored=scoreQuiz(a);const matches=matchCareers(scored.traits).slice(0,5);const saved={...scored,matches,answers:a,created_at:new Date().toISOString()};setResult(saved);if(user){setSaving(true);localStorage.setItem("futurebuddy_quiz",JSON.stringify(saved));setSaving(false);}}
  if(result) return <><PageHead eyebrow="YOUR RESULTS" title="Your career signal is ready." text="Your strongest traits and matching career paths are below."/><section className="container section result-grid"><div className="result-card big"><div className="result-number">{result.total}<small>/ 100</small></div><h2>Overall career signal</h2><div className="trait-list">{Object.entries(result.traits).map(([k,v])=><div key={k}><span>{TRAIT_LABELS[k]||k}</span><div><i style={{width:`${Math.min(v,100)}%`}}/></div><b>{v}</b></div>)}</div></div><div><h2 className="minor-title">Top career matches</h2>{result.matches.map(m=><CareerCard key={m.career.slug} c={m.career} score={m.score}/>) }<div className="center"><Link className="primary-btn" to={user?"/dashboard":"/auth"}>{user?"Open dashboard":"Create account to save results"} <ArrowRight size={17}/></Link></div></div></section></>;
  return <section className="assessment"><div className="container quiz-wrap"><div className="quiz-progress"><span>QUESTION {i+1} / {QUIZ_QUESTIONS.length}</span><div><i style={{width:`${((i)/QUIZ_QUESTIONS.length)*100}%`}}/></div></div><div className="quiz-card"><span className="tag">{q.category}</span><h1>{q.question}</h1><div className="options">{q.options.map((o,j)=><button key={o.label} className={answers[i]===j?"option selected":"option"} onClick={()=>choose(j)}><span>{String.fromCharCode(65+j)}</span>{o.label}</button>)}</div><div className="quiz-actions"><button className="secondary-btn" disabled={i===0} onClick={()=>setI(i-1)}>Back</button><button className="primary-btn" disabled={answers[i]==null} onClick={()=>i===QUIZ_QUESTIONS.length-1?finish(answers):setI(i+1)}>{i===QUIZ_QUESTIONS.length-1?"Finish assessment":"Next question"} <ArrowRight size={17}/></button></div></div></div></section>;
}

function Auth() {
  const [mode,setMode]=useState("login");const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [name,setName]=useState("");const [loading,setLoading]=useState(false);const [msg,setMsg]=useState("");const nav=useNavigate();
  async function submit(e){e.preventDefault();setLoading(true);setMsg("");try{const users=JSON.parse(localStorage.getItem("futurebuddy_users")||"[]");if(mode==="signup"){if(users.some(u=>u.email===email))throw new Error("An account with this email already exists.");const user={id:crypto.randomUUID(),email,full_name:name};users.push({...user,password});localStorage.setItem("futurebuddy_users",JSON.stringify(users));localStorage.setItem("futurebuddy_user",JSON.stringify(user));setMsg("Account created successfully.");nav("/dashboard");}else{const found=users.find(u=>u.email===email&&u.password===password);if(!found)throw new Error("Invalid email or password.");const user={id:found.id,email:found.email,full_name:found.full_name};localStorage.setItem("futurebuddy_user",JSON.stringify(user));setMsg("Welcome back.");nav("/dashboard");}}catch(err){setMsg(err.message)}finally{setLoading(false)}}
  return <section className="auth-page"><div className="auth-card"><div className="auth-logo"><GraduationCap size={25}/></div><div className="eyebrow">{mode==="login"?"WELCOME BACK":"GET STARTED"}</div><h1>{mode==="login"?"Sign in to Future Buddy":"Create your student account"}</h1><p>{mode==="login"?"Continue your career journey.":"Save assessment results, roadmap progress and profile data."}</p><form onSubmit={submit}>{mode==="signup"&&<input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required/>}<input type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} required/><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6}/><button className="primary-btn full" disabled={loading}>{loading?"Please wait…":mode==="login"?"Sign in":"Create account"}</button></form>{msg&&<div className="notice">{msg}</div>}<button className="switch" onClick={()=>setMode(mode==="login"?"signup":"login")}>{mode==="login"?"New here? Create an account":"Already have an account? Sign in"}</button></div></section>;
}

function Dashboard(){const {user}=useAuth();const [data,setData]=useState(null);useEffect(()=>{if(user){try{setData(JSON.parse(localStorage.getItem("futurebuddy_quiz")||"null"));}catch{setData(null);}}},[user]);if(!user)return <RedirectAuth/>;const matches=data?.top_matches||[];return <><PageHead eyebrow="STUDENT HQ" title="Your career dashboard." text="Your assessment, matches and next actions in one place."/><section className="container section"><div className="dashboard-grid"><div className="dashboard-main"><div className="dash-hero"><div><span className="eyebrow light">CAREER SIGNAL</span><h2>{data?`${data.total_score}/100`:"Not assessed yet"}</h2><p>{data?"Your latest assessment is saved. Explore your top matches below.":"Take the assessment to unlock your personalized career signal."}</p></div><Link className="white-btn" to="/assessment">{data?"Retake assessment":"Start assessment"} <ArrowRight size={17}/></Link></div>{matches.length?<><h2 className="minor-title">Your top matches</h2><div className="career-grid">{matches.map(m=>{const c=CAREER_BY_SLUG[m.slug];return c?<CareerCard key={m.slug} c={c} score={m.score}/>:null})}</div></>:<div className="empty-card"><CircleHelp/><h2>No assessment yet</h2><p>Take the 15-question assessment and your matches will appear here.</p><Link className="primary-btn" to="/assessment">Start now</Link></div>}</div><aside className="side-stack"><Link className="quick-card" to="/profile"><UserRound/><b>Profile</b><span>Review your student details</span></Link><Link className="quick-card" to="/roadmap"><Target/><b>Roadmap</b><span>Turn your match into action</span></Link><Link className="quick-card" to="/skills"><Zap/><b>Skills</b><span>Explore skills worth building</span></Link></aside></div></section></>}

function Profile(){const {user}=useAuth();const [p,setP]=useState(null);useEffect(()=>{if(user){setP({...user,email:user.email});}},[user]);if(!user)return <RedirectAuth/>;return <><PageHead eyebrow="YOUR PROFILE" title="Your student profile." text="The information used to personalize your career guidance."/><section className="container section narrow">{p?<div className="detail-card"><div className="facts">{Object.entries({Name:p.full_name,Email:p.email,Age:p.age,Education:p.education_level,Stream:p.stream,Graduation:p.graduation_year,Interest:p.interested_field,Goal:p.career_goal,JobType:p.preferred_job_type,Location:p.preferred_location}).map(([k,v])=><span key={k}><b>{k}</b>{v||"—"}</span>)}</div></div>:<div className="empty-card">Loading profile…</div>}</section></>}

function Roadmap(){const {user}=useAuth();const [data,setData]=useState(null);useEffect(()=>{if(user){try{setData(JSON.parse(localStorage.getItem("futurebuddy_quiz")||"null"));}catch{setData(null);}}},[user]);if(!user)return <RedirectAuth/>;const top=data?.top_matches?.[0];const c=top&&CAREER_BY_SLUG[top.slug];return <><PageHead eyebrow="YOUR ROADMAP" title="Build your next 90 days." text="A simple sequence from learning to proof to applications."/><section className="container section narrow">{c?<div className="detail-card"><h2>{c.name}</h2><p>{c.futureScope}</p><ol className="roadmap-list">{c.roadmap.map((s,i)=><li key={s}><span>{i+1}</span>{s}</li>)}</ol><Link className="primary-btn" to={`/careers/${c.slug}`}>Open career plan <ArrowRight size={17}/></Link></div>:<div className="empty-card"><Target/><h2>Roadmap is waiting</h2><p>Complete the assessment first.</p><Link className="primary-btn" to="/assessment">Take assessment</Link></div>}</section></>}

function Salaries(){return <><PageHead eyebrow="SALARY INTELLIGENCE" title="Compare earning potential." text="Browse the salary bands from the actual Future Buddy career dataset."/><section className="container section"><div className="salary-table"><div className="salary-row header"><span>Career</span><span>Fresher</span><span>Experienced</span><span>Demand</span></div>{CAREERS.map(c=><Link to={`/careers/${c.slug}`} className="salary-row" key={c.slug}><span><b>{c.name}</b><small>{c.category}</small></span><span>{c.salary?.[0]?formatLPA(c.salary[0].min,c.salary[0].max):"—"}</span><span>{c.salary?.[c.salary.length-1]?formatLPA(c.salary[c.salary.length-1].min,c.salary[c.salary.length-1].max):"—"}</span><span>{c.demand}</span></Link>)}</div></section></>}

function Skills(){return <><PageHead eyebrow="SKILL TRACKS" title="Build skills employers actually test." text="Use career paths as a practical skills checklist."/><section className="container section"><div className="feature-grid">{[...new Set(CAREERS.flatMap(c=>c.skills))].slice(0,42).map(s=><div className="skill-card" key={s}><Zap size={18}/><b>{s}</b><span>Relevant across {CAREERS.filter(c=>c.skills.includes(s)).length} career paths</span></div>)}</div></section></>}

function Resources(){const items=[
  {id:"upsc",category:"Government",title:"UPSC",description:"Official Union Public Service Commission portal.",official_url:"https://upsc.gov.in"},
  {id:"ssc",category:"Government",title:"SSC",description:"Official Staff Selection Commission portal.",official_url:"https://ssc.gov.in"},
  {id:"ncs",category:"Career",title:"National Career Service",description:"Government career, jobs and counselling resources.",official_url:"https://www.ncs.gov.in"},
  {id:"nptel",category:"Learning",title:"NPTEL",description:"Engineering and technology courses from IITs and IISc.",official_url:"https://nptel.ac.in"},
  {id:"swayam",category:"Learning",title:"SWAYAM",description:"Government-backed online courses and certifications.",official_url:"https://swayam.gov.in"},
  {id:"aicte",category:"Education",title:"AICTE",description:"Official technical education information and resources.",official_url:"https://www.aicte-india.org"},
  {id:"mdn",category:"Technology",title:"MDN Web Docs",description:"Web development documentation for HTML, CSS and JavaScript.",official_url:"https://developer.mozilla.org"},
  {id:"python",category:"Technology",title:"Python",description:"Official Python documentation and learning resources.",official_url:"https://www.python.org"},
];return <><PageHead eyebrow="VERIFIED RESOURCES" title="Learn from official sources." text="Government portals, documentation and certification platforms."/><section className="container section"><div className="resource-grid">{items.map(r=><a className="resource-card" href={r.official_url} target="_blank" rel="noreferrer" key={r.id}><div className="feature-icon"><ShieldCheck size={19}/></div><span className="tag">{r.category}</span><h3>{r.title}</h3><p>{r.description}</p><b>Open official source <ArrowRight size={15}/></b></a>)}</div></section></>}
function GovernmentJobs(){return <><PageHead eyebrow="GOVERNMENT CAREERS" title="Government job pathways." text="Understand eligibility, exams, salary and official recruitment routes."/><section className="container section career-grid">{GOV_CATEGORIES.map(j=><div className="career-card" key={j.slug}><span className="tag">Government</span><h3>{j.name}</h3><p>{j.eligibility}</p><div className="career-meta"><span><GraduationCap size={15}/>{j.qualification}</span><span><Award size={15}/>{j.exam}</span><span><TrendingUp size={15}/>{j.salary}</span></div><a className="text-link" href={j.officialUrl} target="_blank" rel="noreferrer">Official portal <ArrowRight size={16}/></a></div>)}</section></>}

function Compare(){const [a,setA]=useState(CAREERS[0]?.slug||"");const [b,setB]=useState(CAREERS[1]?.slug||"");const A=CAREER_BY_SLUG[a],B=CAREER_BY_SLUG[b];return <><PageHead eyebrow="COMPARE" title="Put two careers side by side." text="Compare education, demand, salary, skills and difficulty before choosing."/><section className="container section"><div className="compare-select"><select value={a} onChange={e=>setA(e.target.value)}>{CAREERS.map(c=><option value={c.slug} key={c.slug}>{c.name}</option>)}</select><span>VS</span><select value={b} onChange={e=>setB(e.target.value)}>{CAREERS.map(c=><option value={c.slug} key={c.slug}>{c.name}</option>)}</select></div><div className="compare-grid">{[A,B].map(c=><div className="detail-card" key={c.slug}><span className="tag">{c.category}</span><h2>{c.name}</h2><div className="facts"><span><b>Demand</b>{c.demand}</span><span><b>Difficulty</b>{c.difficulty}</span><span><b>Education</b>{c.education}</span><span><b>Sector</b>{c.sector}</span><span><b>Fresher salary</b>{c.salary?.[0]?formatLPA(c.salary[0].min,c.salary[0].max):"—"}</span></div><div className="chips">{c.skills.map(s=><span key={s}>{s}</span>)}</div></div>)}</div></section></>}

function SimplePage({title,text,children}){return <><PageHead eyebrow="FUTURE BUDDY" title={title} text={text}/><section className="container section narrow"><div className="detail-card prose">{children}</div></section></>}
function RedirectAuth(){return <NavigateTo path="/auth"/>}
function NavigateTo({path}){const nav=useNavigate();useEffect(()=>nav(path,{replace:true}),[]);return <div className="center page-loading">Redirecting…</div>}
function NotFound(){return <div className="center notfound"><h1>404</h1><p>That page doesn't exist.</p><Link className="primary-btn" to="/">Go home</Link></div>}

export default function App(){
 return <Layout><Routes>
  <Route path="/" element={<Home/>}/><Route path="/careers" element={<Careers/>}/><Route path="/careers/:slug" element={<CareerDetail/>}/>
  <Route path="/assessment" element={<Assessment/>}/><Route path="/auth" element={<Auth/>}/><Route path="/dashboard" element={<Dashboard/>}/>
  <Route path="/profile" element={<Profile/>}/><Route path="/roadmap" element={<Roadmap/>}/><Route path="/salaries" element={<Salaries/>}/>
  <Route path="/skills" element={<Skills/>}/><Route path="/resources" element={<Resources/>}/><Route path="/government-jobs" element={<GovernmentJobs/>}/>
  <Route path="/private-jobs" element={<SimplePage title="Private jobs" text="Explore private-sector career directions and build proof of skill."><p>Use the Career Explorer to identify a role, then follow its skills and roadmap. You can also compare paths before applying.</p><Link className="primary-btn" to="/careers">Explore careers</Link></SimplePage>}/>
  <Route path="/compare" element={<Compare/>}/><Route path="/about" element={<SimplePage title="About Future Buddy" text="A student-built career guidance platform."><p>Future Buddy is designed as an engineering final-year project to help students make more informed career decisions using structured assessment, career data, salary ranges, roadmaps and official resources.</p><p>Career and salary information is for educational guidance only. Verify important eligibility, salary and application details with official sources.</p></SimplePage>}/>
  <Route path="/contact" element={<SimplePage title="Contact" text="Questions, feedback or project suggestions."><p>For a project demonstration, bug report or improvement suggestion, connect with the project owner through the channel where this project was shared.</p></SimplePage>}/>
  <Route path="/privacy" element={<SimplePage title="Privacy Policy" text="How Future Buddy handles account information."><p>Account information and assessment results are stored locally in your browser for this demo. Do not submit sensitive personal information that is not required for career guidance.</p></SimplePage>}/>
  <Route path="/terms" element={<SimplePage title="Terms of Service" text="The rules for using Future Buddy."><p>Future Buddy provides career guidance for informational and educational purposes only. Salary figures, eligibility criteria and exam details can change. Always verify important information on official government, institutional and employer websites.</p></SimplePage>}/>
  <Route path="*" element={<NotFound/>}/>
 </Routes></Layout>
}
