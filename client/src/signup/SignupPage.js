import React from 'react';
import axios from 'axios';
import { withRouter } from '../withRouter'; 
import LogoHeader from '../components/LogoHeader';

class SignupPage extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
        username: '',
        password: '',
        confirmPassword: '',
        error: '',
        success: '',
    };
    }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: '', success: '' });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { username, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      this.setState({ error: 'パスワードが一致しません。' });
      return;
    }

    axios.post('/users/signup', { username, password, backgroundId:13, avatarId:1 })
      .then(() => {
        this.setState({
          success: 'ユーザ登録が完了しました。ログインしてください。',
          username: '',
          password: '',
          confirmPassword: '',
          error: '',
        });
        // this.props.navigate('/', {
        //     state: { message: 'ユーザー登録が完了しました' }
        // });
      })
      .then(() => {
        // axios.get("/users/"+username)
        // .then(json => {
        //   console.log("ユーザ情報取得", json.data);
          // axios.post('/user-images', {userId: 7, imageType:0, imageId:1})
          // .then(json => console.log("user_imagersに初期アバター登録完了"))
          // .catch(error => console.error(error))
        })
      // })
      .catch(error => {
        let message = '登録に失敗しました。もう一度お試しください。';
        if (error.response?.status === 409) {
          message = 'そのユーザーIDは既に使われています。';
        }
        this.setState({ error: message });
      });

      
  };

  render() {
    const { username, password, confirmPassword, error, success } = this.state;

    return (
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        <LogoHeader/>
        <h2>ユーザ登録</h2>

        {error && (
          <div style={{ color: 'white', backgroundColor: 'red', padding: '10px', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ color: 'white', backgroundColor: 'green', padding: '10px', marginBottom: '15px' }}>
            {success}
          </div>
        )}

        <form onSubmit={this.handleSubmit}>
          <div>
            <label>ユーザーID</label><br />
            <input
              type="text"
              name="username"
              value={username}
              onChange={this.handleChange}
              required
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>パスワード</label><br />
            <input
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
              required
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>パスワード（確認）</label><br />
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={this.handleChange}
              required
            />
          </div>
          <button type="submit" style={{ marginTop: '20px' }}>登録</button>
        </form>

        {/* ログインページへのリンク */}
        <p style={{ marginTop: '20px' }}>
          すでにアカウントを持っている人は <a href="/" style={{color: "white"}}>こちら</a>
        </p>
      </div>
    );
  }
}

export default (SignupPage);