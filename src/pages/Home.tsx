//import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import illustrationImg from '../assets/images/illustration.svg' //webpack -> Module Bundler -> converte o arquivo para formato aceitável
import logoImg from '../assets/images/logo.svg'
import eletroLogoImg from '../assets/images/logo-branca.png'
import googleIconImg from '../assets/images/google-icon.svg'
import '../styles/auth.scss'
import { Button } from '../components/Button'
import { firebase, authentication } from '../services/firebase'
//import { AuthContext } from '../contexts/AuthContext'
import { useAuth } from '../hooks/useAuth'

export const Home = () => {
  const history = useHistory();
  const {user, signInWithGoogle} = useAuth();


  async function handleCreateRoom() {
    if(!user){
      await signInWithGoogle();
    }
      history.push('/rooms/new');
      console.log(user)
    
  }

  return (
    <div id="page-auth">
      <aside>
        <div id="images">
          <img src={eletroLogoImg} alt="ilustração Eletroflash" id="eletro-logo"/>
          <img src={illustrationImg} alt="ilustração principal" />
        </div>
        <div>
          <strong>Crie salas de Q&amp;A ao-vivo.</strong>
          <p>Tire as dúvidas de automação em tempo real com nosso corpo técnico!</p>
        </div>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="LetMeAsk" />
          <button className="google-btn" onClick={handleCreateRoom} formTarget="_blank">
            <img src={googleIconImg} alt="ícone Google" />            
            Crie sua sala com o Google
          </button>

          <div className="separator">ou entre em uma Sala</div>
          <form action="">
            <input type="text" placeholder="Digite o código da sala"/>
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}