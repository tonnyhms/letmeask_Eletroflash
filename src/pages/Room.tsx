import { FormEvent, useEffect, useState } from 'react';
import toast, {Toaster} from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import eletroflashImg from '../assets/images/logo-branca.png'
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { banco } from '../services/firebase';
import '../styles/room.scss';

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  },
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
}>

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  },
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
}

type ParamsProps = {
  id: string;
}

export function Room(){
  const params = useParams<ParamsProps>();
  const {user, signInWithGoogle} = useAuth();
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = banco.ref(`rooms/${params.id}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighLighted: value.isHighLighted,
          isAnswered: value.isAnswered,  
        }
      })
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    })
  }, [params.id])

  async function handleCreateNewQuestion(event: FormEvent){
    event.preventDefault();

    if(newQuestion.trim() === ''){
      toast.error("Não pode gerar uma pergunta vazia.");
      return;
    }

    if(!user){
      toast.error("Você precisa estar logado para enviar uma nova pergunta.");
      throw new Error("Missing Auth");
    }

    const question = {
      author:{
        name: user.name,
        avatar: user.avatar,
      },
      content: newQuestion,
      isHighLighted: false,
      isAnswered: false,
    }

    await banco.ref(`rooms/${params.id}/questions`).push(question);
  }

  return (
    <div id='page-room'>
      <Toaster/>
      <header>
        <div className='content'>
          <div>
            <img src={eletroflashImg} alt="Logo Eletroflash" />
            <img src={logoImg} alt="LetMeAsk" />
          </div>
          <RoomCode code={params.id}/>
        </div>
      </header>
      <main>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} {questions.length <= 1 ? 'pergunta' : 'perguntas'}</span> }
        </div>

        <form onSubmit={handleCreateNewQuestion}>
          <textarea 
            placeholder="Digite sua dúvida aqui."
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            { user ? (
              <div className='user-info'>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ): (<span>Para enviar uma pergunta, <button>faça seu login.</button></span>)}
            
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
            
          </div>
        </form>
      </main>

    </div>
  );
}