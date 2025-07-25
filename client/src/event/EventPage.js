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
            loginUserId: 1,             // ログインユーザーのid　仮で1とする！！！！！！！！！！！！
            events: [],                 // セレクトボックスに表示するイベント用配列
            selectedEventIndex: 0,      // 選択中イベントの配列の添え字
            selectedEventTheme: "",     // 選択中のイベントテーマ
            content: "",                // 投稿内容
            posts: [],                  // 他の人の投稿を格納する配列
            isPosted: false,            // ログインユーザーの投稿状態　デフォルトは未投稿
            myLikeCount: 0,             // ログインユーザーの投稿についたいいね数
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

            const data = {
                eventId: selectedEvent.id,          // 選択中イベントid
                userId: this.state.loginUserId      // ログインユーザーのid
            };
            // 選択中イベントの全投稿取得
            axios.post("/api/postList/", data)
            .then(response => {
                console.log("他のユーザーの投稿");
                console.log(response.data);
                this.setState({
                    posts: response.data                    // 選択中イベントの全投稿
                });
            })
            // ログインユーザーの投稿取得
            axios.post("/api/myPost/", data)
            .then(response => {
                console.log("ログインユーザーの投稿");
                // レスポンスの有無チェック
                if (response.data != "") {          // レスポンスがある(=投稿済み)の場合
                    console.log(response.data);
                    this.setState({
                        content: response.data.content,         // 投稿内容
                        myLikeCount: response.data.count,       // 投稿についたいいね数
                        isPosted: true                          // 投稿状態を投稿済みに
                    });
                } else {
                    this.setState({
                        content: "",                            // 投稿内容の初期化
                        myLikeCount: 0,                         // いいね数の初期化
                        isPosted: false                         // 投稿状態の初期化
                    });
                }
            })
        });
    }

    // 表示イベント変更
    changeEvent = (e) => {
        const {events} = this.state;            // stateのイベント配列取得
        const targetIndex = e.target.value;     // セレクトボックスから選択された配列の添え字取得
        this.setState({
            selectedEventIndex: targetIndex,                // 選択中イベントの配列の添え字
            selectedEventTheme: events[targetIndex].theme   // 選択中イベントのテーマ
        });
        
        const data = {
            eventId: events[targetIndex].id,        // 選択中イベントid
            userId: this.state.loginUserId          // ログインユーザーのid
        };
        // 選択中イベントの全投稿取得
        axios.post("/api/postList/", data)
        .then(response => {
            console.log(response.data);
            this.setState({
                posts: response.data            // 選択中イベントの全投稿
            });
        })

        // ログインユーザーの投稿取得
        axios.post("/api/myPost/", data)
        .then(response => {
            console.log("ログインユーザーの投稿");
            // レスポンスの有無チェック
            if (response.data != "") {          // レスポンスがある(=投稿済み)の場合
                console.log(response.data);
                this.setState({
                    content: response.data.content,         // 投稿内容
                    myLikeCount: response.data.count,       // 投稿についたいいね数
                    isPosted: true                          // 投稿状態を投稿済みに
                });
            } else {
                this.setState({
                    content: "",                            // 投稿内容の初期化
                    myLikeCount: 0,                         // いいね数の初期化
                    isPosted: false                         // 投稿状態の初期化
                });
            }
        })
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
        // 投稿確認ダイアログ表示　キャンセルの場合は登録処理をせずに返す
        if (!window.confirm("投稿はイベントにつき1回だけできます。投稿しますか？")) {
            return;
        }

        const {loginUserId, events, selectedEventIndex, myLikeCount, content} = this.state;     // stateから必要な情報取得
        const userPost = {
            eventId: events[selectedEventIndex].id,     // 選択中イベントのid
            userId: loginUserId,                        // ログインユーザーid
            content: content,                           // 入力された投稿内容
            count: myLikeCount                          // いいね数　デフォルトの0
        }
        // 登録処理
        axios.post("/api/post/", userPost)
        .then(response => {
            this.setState({
                isPosted: true          // 投稿状態を投稿済みに
            });
            this.componentDidMount();   // 初期表示
        })
    }

    // いいね
    toggleLike = (index) => {
        const {posts, loginUserId} = this.state;
        const data = {
            postId: posts[index].id,        // いいねボタンを押した投稿のid
            userId: loginUserId             // ログインユーザーid
        }
        console.log(posts[index]);
        console.log("index" + index + ", evaluation_id" + posts[index].evaluationId);
        console.log(data);
        // いいね登録・解除処理
        axios.post("/api/changeEvaluation/", data)
        .then(response => {
            if (response.data != null) {
                const newPosts = [...posts];            // 投稿配列のコピー
                newPosts[index] = response.data;        // コピーした配列でいいね処理した投稿データ更新
                console.log(response.data);
                console.log(newPosts[index]);
                this.setState({
                    posts: newPosts             // 更新後の配列で更新
                });
            } else {
                window.alert("いいねができませんでした");
            }
        });
    }

    render() {
        const {events, selectedEventIndex, selectedEventTheme, content, myLikeCount, isPosted, posts} = this.state;
        return (
            <div id="event_page">
                {/* メニューコンポーネント */}
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
                <div className="container">
                    <div className="post_content">
                        {/* disabled属性で投稿済みの場合は変更不可に */}
                        <textarea name="content" id="content" placeholder="投稿内容" onChange={this.onInput} value={content} disabled={isPosted}/>
                    </div>
                    <div className="post_footer">
                        {/* ログインユーザーが投稿済みの場合はいいね数、未投稿の場合は投稿ボタン表示 */}
                        {isPosted
                            ? <p>{myLikeCount}いいね</p>
                            : <button onClick={this.addMyPost}>投稿</button>
                        }
                    </div>
                </div>
                
                {/* 投稿一覧 */}
                <div id="other">
                    <h3>他の人の投稿内容</h3>

                    <div className="container">
                        {posts.map((post, index) =>
                            <div className="post">
                                <div className="post_content">
                                    <p>{post.content}</p>
                                </div>
                                <div className="post_footer">
                                    <p>{post.count}</p>
                                    <button onClick={() => {this.toggleLike(index)}} className={post.evaluationId
                                        ? "like"
                                        : "not_like"
                                        }
                                    >{post.evaluationId ? "いいね済み" : "いいね！"}</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}