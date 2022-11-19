import { observer } from 'mobx-react-lite';
import categories from '../store/categories';
import { useCallback, useEffect, useState } from 'react';
import { routes } from '../constants/routes';
import { useNavigate } from 'react-router-dom';
import startGame from '../store/game';
import game from '../store/game';
import { dayJS } from '../lib/dayjs';
import { Button, Input, List, Modal, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';

export default observer(function Home(): JSX.Element {
  const [enteredName, setEnteredName] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    categories.getCategories();
    const currentUser = JSON.parse(localStorage.getItem('name')!);
    if (dayJS().isAfter(currentUser?.expiration_date)) {
      setCurrentUsername('');
    } else {
      setCurrentUsername(currentUser?.name);
    }
  }, []);

  const startGameHandler = useCallback(() => {
    //  save user name into locale storage for 30 minutes
    // this way we give user to play for 30 minutes without each time writing username
    setCurrentUsername(enteredName);
    localStorage.setItem(
      'name',
      JSON.stringify({
        name: enteredName,
        expiration_date: +dayJS().minute(dayJS().minute() + 30),
      }),
    );
    game.start();
  }, [enteredName]);

  return (
    <Wrapper>
      <StyledModal open={!currentUsername} footer={null} closable={false}>
        <Typography.Title level={2} className="modal_title">
          Enter username
        </Typography.Title>
        <Typography.Paragraph type="warning" className="input_info">
          Please use unique username if you are new player
        </Typography.Paragraph>

        <Input.Group compact className="input_name">
          <Input
            placeholder="John Doe"
            prefix={<UserOutlined />}
            value={enteredName}
            style={{ width: 'calc(100% - 52px)' }}
            onChange={(e) => setEnteredName(e.target.value)}
          />
          <Button type="primary" onClick={startGameHandler}>
            Go
          </Button>
        </Input.Group>
      </StyledModal>
      <Typography.Title>Choose category </Typography.Title>
      <Typography.Paragraph type="secondary">
        Please Choose one of the following category to start the game
      </Typography.Paragraph>
      <div className="categories">
        <List
          dataSource={categories.categories}
          size="small"
          bordered
          renderItem={(category) => (
            <List.Item
              className="list_item"
              onClick={() => {
                startGame.getQuestionsByCategory(category.id);
                navigate(routes.PLAYING);
              }}
            >
              <Typography.Text strong>{category.title.toLocaleUpperCase()}</Typography.Text>
            </List.Item>
          )}
        />
        <Button type="primary" size="large" onClick={() => categories.getCategories()}>
          Load different categories
        </Button>
      </div>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  .list_item {
    cursor: pointer;
    &:hover {
      background: rgba(225, 225, 225, 0.5);
    }
  }
  .categories {
    max-width: 800px;
    justify-self: center;
    align-self: center;
    button {
      margin-top: 20px;
    }
  }
`;

const StyledModal = styled(Modal)`
  .modal_title {
    margin: 10px 0 40px;
  }
  .input_info {
    margin-bottom: 10px;
  }
  .input_name {
    margin-bottom: 10px;
  }
`;
