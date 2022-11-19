import game from '../store/game';
import { List, Typography } from 'antd';
interface RecordsModalProps {
  message?: string;
}

interface Record {
  username: string;
  score: number;
}

export default function RecordsModal({ message }: RecordsModalProps): JSX.Element {
  //get records from localStorage
  const records: Record[] = JSON.parse(localStorage.getItem('records')!) || [];
  records?.reverse();
  // check if our new score is higher than all record scores inside of records array
  const isNewRecord = !records?.every((record) => record.score >= game.score);

  const { name } = JSON.parse(localStorage.getItem('name')!);

  if (isNewRecord) {
    const newRecord = { username: name || 'Unknown user', score: game.score };
    //check if the current user in records then change only the user score to new higher one
    const indexOfExistingUser = records.findIndex((record) => record.username === name);
    if (indexOfExistingUser === -1 && game.score) {
      records.push(newRecord);
    } else {
      //if user is not in records array then adds new element into array
      records[indexOfExistingUser] = newRecord;
    }

    localStorage.setItem('records', JSON.stringify(records));
  }
  return (
    <>
      <Typography.Title level={2}>Game over </Typography.Title>
      {message && <Typography.Paragraph>{message}</Typography.Paragraph>}
      {isNewRecord && game.score ? (
        <p>Congrats new record {game.score}</p>
      ) : (
        <p>Your score is {game.score}</p>
      )}
      <List
        dataSource={records}
        size="small"
        bordered
        renderItem={(record: Record) => (
          <List.Item className="list_item">
            <Typography.Text strong>{record?.username}</Typography.Text> {record?.score}
          </List.Item>
        )}
      />
    </>
  );
}
