import { useEffect, useState } from "react";
import "./App.css";
// import axios from "axios";
import api from "./axios/api";

function App() {
  const [todos, setTodos] = useState(null);
  const [inputValue, setInputValue] = useState({
    title: "",
  });
  const [targetID, setTargetID] = useState("");
  const [contents, setContents] = useState("");

  //조회
  const fetchTodos = async () => {
    const { data } = await api.get("/todos");
    setTodos(data);
  };

  // 추가
  const onSubmitHandler = async () => {
    api.post("/todos", inputValue);
    setTodos([...todos, inputValue]);
    fetchTodos();
  };

  // 삭제
  const onDeleteButtonClickHandler = async (id) => {
    api.delete(`/todos/${id}`);
    setInputValue(
      todos.filter((item) => {
        return item.id !== id;
      })
    );
  };

  // 수정
  const onEditHandler = async () => {
    api.patch(`/todos/${targetID}`, {
      title: contents,
    });

    setTodos(
      todos.map((todo) => {
        if (todo.id === targetID) {
          return { ...todo, title: contents };
        } else {
          return todo;
        }
      })
    );
  };

  useEffect(() => {
    //db로부터 값을 가져 옴
    fetchTodos();
  }, []);

  return (
    <>
      <div>
        <div>
          <input
            type="text"
            placeholder="수정할 ID"
            value={targetID}
            onChange={(e) => setTargetID(e.target.value)}
          />
          <input
            type="text"
            placeholder="수정할 내용"
            value={contents}
            onChange={(e) => setContents(e.target.value)}
          />
          <button onClick={onEditHandler}>수정</button>
        </div>
        <form
          action=""
          onSubmit={
            (e) => e.preventDefault()
            // 버튼 클릭 시, input에 들어있는 값(state)을 이용하여 DB에 저장(post)요청
          }>
          <input
            type="text"
            value={inputValue.title}
            onChange={(e) => {
              setInputValue({ title: e.target.value });
            }}
          />
          <button type="submit" onClick={onSubmitHandler}>
            추가
          </button>
        </form>
      </div>

      <div>
        {todos?.map((item) => {
          return (
            <>
              <p key={item.id}>
                {item.id} : {item.title}
                <button onClick={() => onDeleteButtonClickHandler(item.id)}>
                  삭제
                </button>
              </p>
            </>
          );
        })}
      </div>
    </>
  );
}

export default App;
