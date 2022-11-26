import "./App.css";
import io from "socket.io-client";
import { SOCKET_PORT } from "./config";
import { useState, useEffect } from "react";

const socket = io(SOCKET_PORT);

function App() {
    const [msgComponent, setMsgComponent] = useState({}); // msg content to send
    const [saveMsg, setSaveMsg] = useState([]); // msg list

    const handleSubmitForm = (e) => {
        e.preventDefault();
        if (msgComponent.author !== undefined && msgComponent.author !== "") {
            socket.emit("msg", msgComponent);
            setSaveMsg([...saveMsg, { msg: msgComponent.msg, author: "me" }]);
            setMsgComponent({ ...msgComponent, msg: "" });
        } else {
            alert("Please, enter a valid name.");
        }
    };

    useEffect(() => {
        const reciveMsg = (msgObject) => {
            setSaveMsg([...saveMsg, msgObject]);
        };

        socket.on("msg", (msgObject) => reciveMsg(msgObject));

        return () => {
            socket.on("msg", (msgObject) => reciveMsg(msgObject));
        };
    }, [saveMsg]);

    return (
        <div className="w-full h-screen bg-blue-300 inline-flex flex-col justify-between text-lg md:flex md:flex-row">
            <div className="min-h-[50%] md:min-h-[75%] p-5 m-5 md:m-10 bg-blue-200 min-w-[25%] overflow-y-auto">
                {saveMsg.map((item, index) => (
                    <div
                        key={index}
                        className={`table border border-1 my-2 p-2 text-sm rounded-2xl ${
                            item.author === "me"
                                ? "text-slate-800 bg-blue-300 ml-auto rounded-br-none"
                                : "text-slate-900 rounded-bl-none bg-blue-400"
                        }`}
                    >
                        <div className="via-cyan-300 underline decoration-solid text-slate-700">
                            ({item.author})
                        </div>
                        {item.msg}
                    </div>
                ))}
            </div>
            <form
                onSubmit={(e) => handleSubmitForm(e)}
                className="md:py-40 p-5 bg-blue-700 flex flex-col text-center"
            >
                <input
                    className="rounded-md bg-blue-300 text-blue-700 pl-3 m-1 placeholder:text-blue-400 "
                    type="text"
                    name="author"
                    placeholder="Enter your name: "
                    onChange={(e) =>
                        setMsgComponent({
                            ...msgComponent,
                            [e.target.name]: e.target.value,
                        })
                    }
                />

                <input
                    className="rounded-md bg-blue-300 text-blue-700 py-2 pl-3 m-1 placeholder:text-blue-400"
                    type="text"
                    name="msg"
                    autoFocus
                    placeholder="Enter your message: "
                    onChange={(e) =>
                        setMsgComponent({
                            ...msgComponent,
                            [e.target.name]: e.target.value,
                        })
                    }
                    value={msgComponent.msg}
                />
                <button className="m-1 mt-2 border-2 border-blue-300 rounded-lg text-blue-300 capitalize hover:bg-blue-300 hover:text-blue-700">
                    send
                </button>
            </form>
        </div>
    );
}

export default App;
