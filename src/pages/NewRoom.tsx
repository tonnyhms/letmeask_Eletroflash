import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import illustrationImg from '../assets/images/illustration.svg' //webpack -> Module Bundler -> converte o arquivo para formato aceitável
import logoImg from '../assets/images/logo.svg'
import eletroLogoImg from '../assets/images/logo-branca.png'
import googleIconImg from '../assets/images/google-icon.svg'
import '../styles/auth.scss'
import { Button } from '../components/Button'
import { userInfo } from 'os'
import { banco } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'


export const NewRoom = () => {
  const { user } = useAuth();
  const history = useHistory(); 
  const [newRoom, setNewRoom] = useState('');

  async function handleCreateNewRoom(event: FormEvent){
    event.preventDefault();

    if(newRoom.trim() === ''){
      return;
    }

    const roomRef = banco.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    })

    history.push(`/rooms/${firebaseRoom.key}`)
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

          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateNewRoom}>
            <input 
              type="text" 
              placeholder="Nome da sala" 
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}  
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p className="message">Deseja entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
        </div>
      </main>
    </div>
  )
}