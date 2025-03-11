import { BrowserRouter, Route, Routes } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Wrapper from "./components/Wrapper";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Wrapper>
                    <Routes>
                        <Route index element={<Accueil/>}/>
                        <Route path="login" element={<Login/>}/>
                        <Route path="register" element={<Register/>}/>
                    </Routes>
                </Wrapper>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;