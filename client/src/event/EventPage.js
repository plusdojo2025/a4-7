import React from "react";
import Menu from '../components/MenuHeader';
import './eventPage.css';
import axios from "axios";

export default class EventPage extends React.Component {
    // コンストラクタ
    constructor(props) {
        super(props);
        // state
        this.state = {
            events: [],                 // セレクトボックスに表示するイベント用配列
            selectedEventIndex: 0,      // 選択中イベントの配列の添え字
            selectedEventTheme: "",     // 選択中のイベントテーマ
            content: "",                // 投稿内容
            like: false,                // いいねのステータス　デフォルトはいいねしてない状態
            posts: [],                  // 他の人の投稿を格納する配列
        }
    }

    // 初期表示
    componentDidMount() {
        // セレクトボックス用のイベント一覧取得
        fetch("/api/eventList/")
        .then(res => res.json())
        .then(json => {
            const selectedEvent = json[json.length - 1];    // 配列末尾のイベント情報取得　デフォルトは現在開催中のイベント
            this.setState({
                events: json,                               // 過去から現在開催中までの全イベント
                selectedEventIndex: json.length - 1,        // 選択中イベントの配列の添え字
                selectedEventTheme: selectedEvent.theme     // 選択中イベントテーマ
            })

            // 選択中イベントの全投稿取得
            const data = {eventId: selectedEvent.id};       // 選択中イベントid
            axios.post("/api/postList/", data)
            .then(response => {
                console.log(response.data);
                this.setState({
                    posts: response.data                    // 選択中イベントの全投稿
                });
            })
        });
    }

    // 表示イベント変更
    changeEvent = (e) => {
        const {events} = this.state;
        const targetIndex = e.target.value;
        this.setState({
            selectedEventIndex: targetIndex,
            selectedEventTheme: events[targetIndex].theme
        });

        // 選択中イベントの全投稿取得
        const data = {eventId: events[targetIndex].id};       // 選択中イベントid
        axios.post("/api/postList/", data)
        .then(response => {
            console.log(response.data);
            this.setState({
                posts: response.data                    // 選択中イベントの全投稿
            });
        })

        setTimeout(() => {
            // ほんの少し待ってから反映後の状態を見る
            console.log('→' + this.state.selectedEventIndex);
        }, 0);
    }

    // 入力時にstate更新
    onInput = (e) => {
        // 入力されたinputタグのname属性取得
        const key = e.target.name;
        this.setState({
            [key]: e.target.value   // name属性と同じ変数名のstate更新
        });
    }

    // 投稿内容登録
    addMyPost = () => {
        const {content} = this.state;
        console.log(content);
    }

    // いいね
    toggleLike = () => {
        const like = this.state.like;
        console.log(like);
        this.setState({
            like: !like
        });
        setTimeout(() => {
            // ほんの少し待ってから反映後の状態を見る
            console.log('→' + this.state.like);
        }, 0);
    }

    render() {
        const {events, selectedEventIndex, selectedEventTheme, content, posts} = this.state;
        return (
            <div id="event_page">
                <Menu></Menu>

                {/* 表示イベント選択セレクトボックス　デフォルトは現在開催中のイベント */}
                <select value={selectedEventIndex} onChange={this.changeEvent}>
                    {events.map((event, index) =>
                        <option key={event.id} value={index}>{event.title}</option>     // valueには配列の添え字を格納
                    )}
                </select>

                {/* イベントテーマ */}
                <h2>お題：{selectedEventTheme}</h2>

                {/* 投稿 */}
                <div>
                    <input type="text" name="content" placeholder="投稿内容" onChange={this.onInput} value={content}/>
                    <button onClick={this.addMyPost}>投稿</button>
                </div>
                
                {/* 投稿一覧 */}
                <div>
                    <h3>他の人の投稿内容</h3>

                    <div id="container">
                        {posts.map((post, index) =>
                            <div className="post">
                                <div className="post_content">
                                    <p>{post.content}</p>
                                </div>
                                <div className="post_fotter">
                                    <p>{post.count}</p>
                                    <button onClick={this.toggleLike}>いいね！</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        );
    }
}