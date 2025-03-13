import { BrowserRouter, Route, Routes } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Wrapper from "./components/Wrapper";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile.tsx";
import Parametre from "./pages/Parametre.tsx";
import PostDetail from "./pages/PostDetail.tsx";
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Wrapper>
                    <Routes>
                        <Route index element={<Accueil/>}/>
                        <Route path="/post/:id" element={<PostDetail />} />
                        <Route path="login" element={<Login/>}/>
                        <Route path="register" element={<Register/>}/>
                        <Route path="/profile/:userId" element={<Profile/>}/>
                        <Route path="register" element={<Register/>}/>
                        <Route path="parametre" element={<Parametre/>}/>
                    </Routes>
                </Wrapper>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;