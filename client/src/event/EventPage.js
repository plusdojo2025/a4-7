import React from "react";

export default class EventPage extends React.Component {
    // コンストラクタ

    // 投稿内容取得

    // いいね

    // 投稿内容登録


    render() {
        return (
            <div>
                {/* 表示イベント選択セレクトボックス */}
                <select>
                    <option value={"イベントタイトル"}>イベントタイトル</option>
                </select>

                {/* イベントテーマ */}
                <h2>お題：イベントタイトル</h2>

                {/* 投稿フォーム */}
                <form>
                    <input type="text" name="content" placeholder="投稿内容"/>
                    <input type="submit" value={"投稿"}/>
                </form>
                
                {/* 投稿一覧 */}
                <div>
                    <h3>他の人の投稿内容</h3>

                    <div>
                        <p>投稿内容</p>
                        <p>17</p>
                        <button>いいね！</button>
                    </div>
                </div>
            </div>
        );
    }
}