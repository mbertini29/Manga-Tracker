import "./HomePage.css";
import { useNavigate } from "react-router";
import { app, db } from "./firebase.ts";
import { collection, doc, setDoc, onSnapshot, updateDoc , deleteDoc} from "firebase/firestore";
import { useEffect, useState , useRef} from "react";
import { getAuth, signOut, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import type { User } from "firebase/auth";
import type { QuerySnapshot, DocumentData } from "firebase/firestore";
import type { Manga , JikanResponse } from "./types"
import { FiSearch } from "react-icons/fi";

const auth = getAuth(app);


const HomePage = () => {
    const navigate = useNavigate();
    const hoverTimeout = useRef<number>(0);
    const [userHover, setUserHover] = useState<boolean>(false);
    const [currentUser,setCurrentUser] = useState<User | null>(null)
    const [mangas, setMangas] = useState<Manga[]>([]);
    const [titolo, setTitolo] = useState<string>("");
    const [capitolo, setCapitolo] = useState<string>("");
    const isHovered = useRef<string>("");
    const [search, setSearch] = useState<string>("");
    const [mousePos, setMousePos] = useState<{x:number;y:number}>({ x: 0, y: 0 });
    const [image, setImage] = useState<string>("");
    const [noimage,setNoImage] = useState<boolean>(true);
    
    useEffect(() => {
    const disabilita = onAuthStateChanged(auth, (currentuser) => {
        setCurrentUser(currentuser);
        if (!currentuser) {
            navigate("/");
        }
    });

    return disabilita; // rendi disponibile la variabile che disabilita il listener a react e lui la chiama quando vuole 
    }, [navigate]);
      

    useEffect(() => {
        if (!currentUser) return;
        const ColRef = collection(db, "utenti", currentUser.uid, "mangas");
        const disabilita = onSnapshot(ColRef, (snapshot: QuerySnapshot<DocumentData>) => {      // onSnapshot rimane in ascolto di ColRef per dei cambiamenti e chiama 
          const ListaManga: Manga[] = snapshot.docs.map((manga) => ({                           // la funzione fornita se ne rileva
            id: manga.id,       
            capitolo: manga.data().capitolo,
            completato: manga.data().completato ?? false
          }));
      
          setMangas(ListaManga);
        });
      
        return disabilita; // rendi disponibile la variabile che disabilita il listener a react e lui la chiama quando vuole 
    }, [currentUser]);

    async function searchManga(query: string): Promise<void> {
        const response = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=1`);
        const data:JikanResponse = await response.json();
        if (data.data.length === 0) {
            return;
        }
        if (isHovered.current !== query) 
            return;
        
        setImage(data.data[0].images.jpg.large_image_url);
    }


    const handleLogout = async() => {
        try{
            await signOut(auth);
        }
        catch(error: unknown){
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    };

    const apriMAL = async (titolo:string):Promise<void> =>{
        const response = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(titolo)}&limit=1`);
        const data = await response.json();
        if (data.data.length > 0) {
            window.open(data.data[0].url, "_blank", "noopener,noreferrer");
        }
    }

    const handlePassword = async():Promise<void> =>{
        try{
            if(!currentUser?.email) return;
            await sendPasswordResetEmail(auth,currentUser.email);
            alert("Mandata Email per il cambio della Password");
        }
        catch(error: unknown){
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    }


    const updateChapter = async (id: string,newChapter: number): Promise<void> => {
        try {
            if (!currentUser) return;
            const docRef = doc(db,"utenti",currentUser.uid,"mangas",id);
            await updateDoc(docRef, {capitolo: newChapter});
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    };

    const aggiungiManga = async():Promise<void> =>{
        try{
            const normalized = titolo.trim().toLowerCase();
            for(const e in mangas){
                if(mangas[Number(e)].id.toLowerCase() === normalized){
                    alert("Il manga si trova gia nella lista");
                    return;
                }
            }
            if (capitolo.trim() === "") {
                alert("Inserisci un capitolo");
                return;
            }
            const chapter = Number(capitolo);
            if (Number.isNaN(chapter)) {
                alert("Il capitolo deve essere un numero");
                return;
            }
            const response = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(titolo)}`);
            const data:JikanResponse = await response.json();

            var found:boolean = false;
            for(const e in data.data){
                if((data.data[e].title.toLowerCase() === normalized 
                        || data.data[e].title_english?.toLowerCase() === normalized 
                        || data.data[e].title_japanese?.toLocaleLowerCase() === normalized)){
                    found = true;
                }
            }
            if(!found){
                alert("Manga non esistente");
                return;
            }
            if (!currentUser) return;
            const docRef = doc(db, "utenti", currentUser.uid, "mangas", titolo);
            await setDoc(docRef,{capitolo:Number(capitolo),completato:false});
        }
        catch(error: unknown){
            if (error instanceof Error) {
                alert(error.message);
            }
        }
        setTitolo("");
        setCapitolo("");
    }

    const deleteManga = async(id : string) : Promise<void> =>{
        try{
            if (!currentUser) return;
            await deleteDoc(doc(db, "utenti", currentUser.uid,"mangas",id));
        }
        catch(error: unknown){
            if (error instanceof Error) {
                alert(error.message);
            } 
        }
        setImage("");
    }

    const Completed = async(id : string, completatoAttuale:boolean): Promise<void> =>{
        try {
            if (!currentUser) return;
            const docRef = doc(db,"utenti",currentUser.uid,"mangas",id);
            await updateDoc(docRef, {completato:!completatoAttuale});
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    }

    const filteredMangas = mangas.filter((manga) =>
        manga.id.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <div className="box">
            {image!="" && noimage &&(
                    <div>
                        <img src={image}
                        style={{
                            width:"100px",
                            position:"fixed",
                            left: mousePos.x + 10,
                            top: mousePos.y - 155,
                            pointerEvents: "none",
                            border: "2px solid black",                        
                        }}></img>
                    </div>) 
            }

            <div className="header-pagina">   
                <h1 className="titolo-pagina">
                    <span>Manga</span>
                    Tracker
                </h1>
                <span className="page-subtitle">Organizza e tieni traccia dei manga che stai leggendo</span>
            </div>  

            <div className="user-box" 
                    onMouseEnter={() => setUserHover(true)}
                    onMouseLeave={() => setUserHover(false)}>
                <div className="avatar"></div>
                <div className="user-email">
                    {currentUser?.email}
                </div>
                {userHover && (
                    <div className="user-option">
                        <button className="Logout-btn" onClick={handleLogout}> Logout</button>
                        <button className="CambiaPW-btn" onClick={handlePassword}>Cambia Password</button>
                    </div>
                )}
            </div>
            
            <div className="search-container">
                <FiSearch className="search-icon"/>
                <input
                type="text"
                placeholder="Cerca manga..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="search-input"
                />
            </div>

            <div className="titles-lists">
                <span className="ttl">TITOLO</span>
                <span className="cpt">CAPITOLO</span>
            </div>
            
            
            {mangas.length === 0  && (
                <div className="Lista-vuota">
                    <div className="Lst-vt">
                        <h2>La tua lista è vuota!</h2>
                        <span>Agiungi il tuo primo manga per iniziare a creare la tua collezione</span>
                    </div>
                </div>
            )}
            
            <div className="container">
                <div className="manga-list">
                    {filteredMangas.map((manga) => (
                        <div key={manga.id} className="manga-row" 
                        onMouseMove={(e) =>
                            setMousePos({
                            x: e.clientX,
                            y: e.clientY,
                            })}
                        onMouseEnter={()=>{
                            isHovered.current = manga.id;
                            hoverTimeout.current =  window.setTimeout(() =>{
                                searchManga(manga.id);
                                },300);
                            }}
                        onMouseLeave={()=>{
                            isHovered.current = "";
                            clearTimeout(hoverTimeout.current);
                            setImage("");
                           }}>
                            <div className="info-box">
                                <div className="manga-title" onClick={()=>apriMAL(manga.id)}>{manga.id}</div>
                                {isHovered.current == manga.id && (
                                    <div className="hover-menu">
                                        <button className="delete-btn" onClick={()=>deleteManga(manga.id)}>
                                            Elimina
                                        </button>
                                        <button className="completed-btn" onClick={()=>Completed(manga.id,manga.completato)}>
                                            Completato
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="blocco-capitolo">
                                {manga.completato && (
                                    <span className="completed-sign">[COMPLETATO]</span>
                                )}
                                <div className="chapter-box"
                                onMouseEnter={()=>setNoImage(false)}
                                onMouseLeave={()=>setNoImage(true)}>
                                    <input
                                        type="number"
                                        readOnly={manga.completato}
                                        defaultValue={manga.capitolo}
                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) =>{
                                            if(!manga.completato)
                                                updateChapter(manga.id,Number(e.target.value))
                                            }        
                                        }
                                        className="chapter-input"
                                    />
                                </div>
                            </div>
                            
                        </div>
                    ))}
                </div>
                <div className="Aggiungi-Manga">
                    <button className="New-Manga" onClick={aggiungiManga}>
                       ✚ Aggiungi manga
                    </button>
                    
                    <input className="Input-Manga" 
                    type="text" 
                    placeholder="titolo" 
                    value={titolo} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setTitolo(e.target.value)}            
                    />

                    <input className="Input-Capitolo" 
                    type="text" 
                    placeholder="capitolo" 
                    value={capitolo} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setCapitolo(e.target.value)}    
                    />
                </div>
            </div>
        </div>
    );
};

export default HomePage;