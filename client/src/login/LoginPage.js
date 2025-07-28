import React from 'react';
import axios from 'axios';
import { withRouter } from '../withRouter'; 
import LogoHeader from '../components/LogoHeader';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: ''
    };
  }

  componentDidMount (){
    localStorage.removeItem('userId');
    this.setState({ message: '' });

  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = this.state;

    axios.post('/users/login', { username, password })
        .then(response => {
            // ログイン成功：ユーザーIDを localStorage に保存
            console.log("ログイン成功：ID=", response.data)
            localStorage.setItem('userId', response.data); // TODO: localStorageは開発者ツールから自由に変更できるので、ここにuserIdを直接保存するのは危険。今回は見送り
            alert('ログイン成功！');
            window.location.href = '/schedule';
        })
        .catch(error => {
            // ログイン失敗時のメッセージ制御
            let message = 'ログインに失敗しました。もう一度お試しください。';
            if (error.response?.status === 401) {
                message = 'ユーザーIDまたはパスワードが正しくありません。';
            }
            this.setState({ error: message });
        });
  };

  render() {
    // const message = this.props.location?.state?.message;
    return (
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        <LogoHeader/>
        <h2>ログイン</h2>

        {/* フラッシュメッセージ表示 */}
        {/* {message && (
          <div style={{ backgroundColor: 'green', color: 'white', padding: '10px' }}>
            {message}
          </div>
        )} */}
        {this.state.error && (
          <div style={{ color: 'white', backgroundColor: 'red', padding: '10px', marginBottom: '15px' }}>
            {this.state.error}
          </div>
        )}

        <form onSubmit={this.handleSubmit}>
          <div>
            <label>ユーザーID</label><br />
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
              required
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>パスワード</label><br />
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
          </div>
          <button type="submit" style={{ marginTop: '20px' }}>ログイン</button>
        </form>

        {/* ユーザ登録ページへのリンク */}
        <p style={{ marginTop: '20px' }}>
          まだ登録していない人は <a href="/signup" style={{color: "white"}}>こちら</a>
        </p>
      </div>
    );
  }
}

export default (LoginPage);