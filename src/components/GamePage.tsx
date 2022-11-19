import { observer } from 'mobx-react-lite';
import game from '../store/game';
import { useState } from 'react';
import clearText from '../helpers/clearText';
import { useNavigate } from 'react-router-dom';
import RecordsModal from './RecordsModal';
import styled from 'styled-components';
import { Button, Card, Input, Modal, Typography } from 'antd';

export default observer(function GamePage(): JSX.Element {
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [answerIsRight, setAnswerIsRight] = useState(true);
  const navigate = useNavigate();
  const name = JSON.parse(localStorage.getItem('name')!);

  if (game.lifeCount === 0) {
    game.finish();
  }
  if (game.currentQuestion === undefined) {
    if (game.questionCount > 10) {
      setMessage('Oops sorry there is no question anymore');
    } else {
      setMessage('Thank you this was the last question!');
    }
    game.finish();
  }

  const checkAnswerHandler = () => {
    //  clearText function simplifies user input and right answer then compares
    //  this helps us to ignore  letter case and extra space
    const answerIsRight = clearText(answer) === clearText(game.currentQuestion?.answer!);
    setAnswerIsRight(answerIsRight);
    if (answerIsRight) {
      game.questionCount++;
      game.score += game.currentQuestion?.value! || 1500;
      game.pickQuestion();
    } else {
      //  after wrong answer we are showing the right one for 4.5 seconds then change the next question
      //  meanwhile we don't let user change already submitted answer
      setTimeout(() => {
        game.lifeCount--;
        game.pickQuestion();
        setAnswerIsRight(true);
      }, 4500);
    }
  };

  return (
    <Wrapper>
      <Modal
        open={!game.isGameStarted}
        closable={false}
        footer={[
          <Button
            onClick={() => {
              localStorage.removeItem('name');
              game.reset();
              navigate('/');
            }}
          >
            start as new player
          </Button>,
          <Button
            type="primary"
            onClick={() => {
              game.reset();
              navigate('/');
            }}
          >
            continue as {name?.name}
          </Button>,
        ]}
      >
        <RecordsModal message={message} />
      </Modal>
      <Typography.Title>Hey {name?.name} Good luck! </Typography.Title>
      <Typography.Paragraph>
        During this game you should answer questions of{' '}
        <Typography.Text strong mark>
          {game.category?.title}
        </Typography.Text>{' '}
        category
      </Typography.Paragraph>
      <Typography.Paragraph className="score">
        score <Typography.Text strong>{game.score}</Typography.Text>
      </Typography.Paragraph>

      <Card title={`QUESTION: ${game.currentQuestion?.question}`} className="question">
        <Typography.Paragraph>
          score for question:{' '}
          <Typography.Text strong>{game.currentQuestion?.value}</Typography.Text>
        </Typography.Paragraph>
        {!answerIsRight && (
          <Typography.Paragraph>
            right answer was:{' '}
            <Typography.Text strong mark>
              {game.currentQuestion?.answer}
            </Typography.Text>
          </Typography.Paragraph>
        )}
      </Card>
      <Typography.Paragraph
        className="life"
        strong
        type={game.lifeCount > 1 ? 'warning' : 'danger'}
      >
        {game.lifeCount > 1
          ? `you have ${game.lifeCount} chances`
          : 'this is your last chance, dont waste it'}
      </Typography.Paragraph>

      <Input value={answer} disabled={!answerIsRight} onChange={(e) => setAnswer(e.target.value)} />
      <Button
        type="primary"
        disabled={!answerIsRight}
        size="large"
        className="check_button"
        onClick={checkAnswerHandler}
      >
        check
      </Button>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 20px;

  .score,
  .score span {
    font-size: 30px;
    text-transform: uppercase;
  }
  .question {
    text-align: left;
  }
  .life {
    margin-top: 20px;
  }
  .check_button {
    margin-top: 8px;
  }
`;
