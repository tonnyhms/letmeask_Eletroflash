import { FormEvent, useEffect, useState } from 'react';
import toast, {Toaster} from 'react-hot-toast';
import { useParams, useHistory } from 'react-router-dom';
import eletroflashImg from '../assets/images/logo-branca.png'
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question/index';
import { RoomCode } from '../components/RoomCode';
//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import '../styles/room.scss';
import removeImg from '../assets/images/delete.svg';
import { QuestionDotToken } from 'typescript';
import { banco } from '../services/firebase';
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

type ParamsProps = {
  id: string;
}

export function AdminRoom(){
  const params = useParams<ParamsProps>();
  //const {user, signInWithGoogle} = useAuth();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);
  const history = useHistory();

  async function handleEndRoom(){
    await banco.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/')
  }

  async function handleCheckQuestionAsAnswered(questionId: string){
    await banco.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    })
  }

  async function handleHighlightQuestion(questionId: string){
    await banco.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: true
    })
  }

  async function handleDeleteQuestion(questionId: string){
    if(window.confirm('Tem certeza que deseja excluir essa pergunta? Esta ação não poderá ser desfeita.')){
      await banco.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }

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
          <div className="buttons">
          <RoomCode code={params.id}/>
          <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} {questions.length <= 1 ? 'pergunta' : 'perguntas'}</span> }
        </div>


        <div className="question-list">     
            {questions.map(question => {
              return(
                <Question 
                  key={question.id} 
                  content={question.content} 
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighLighted={question.isHighLighted}
                >
                  {!question.isAnswered && (
                    <>
                  <button type='button' onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                  </button>
                  <button type='button' onClick={() => handleHighlightQuestion(question.id)}>
                    <img src={answerImg} alt="Dar destaque à pergunta" />
                  </button>
                  </>
                  )}
                  <button type='button' onClick={() => handleDeleteQuestion(question.id)}>
                    <img src={removeImg} alt="Remover a pergunta" />
                  </button>
                </Question>
              )   
            })
            }
        </div>
      </main>
     
    </div>
  );
}