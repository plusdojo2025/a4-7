import React from "react";
import axios from 'axios';
import "./SugorokuCell.css"; 
import "./Avatar.css"

class Avatar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userId: localStorage.getItem('userId') || "",
      avatarImgUrlImgIdList: [],
      currentAvatarImgUrl: props.avatarUrl || "",
      showModal: false, 
      setAvatarUrl: props.setAvatarUrl ||  (() => {})
    }
  }

  componentDidMount = () => {
    const {userId, currentAvatarImgUrl, setAvatarUrl} = this.state;

    

      // avatar画像を全取得
      axios.get('/user-images/useravatar/' + userId)
      .then(json => {
        const imageIdList = json.data.map(uImgs => uImgs.imageId);
        return Promise.all( // 非同期の管理のためにPromiseを使用
          imageIdList.map(imgId =>
            axios.get('/api/avatars/' + imgId, { responseType: 'blob' })
            .then(blob => [URL.createObjectURL(blob.data), imgId])
          )
        );
      })
      .then(imageUrl_imageIds => {
        this.setState({
          avatarImgUrlImgIdList: imageUrl_imageIds
        });
      })
      .catch(error => {
        console.error('avatar画像の取得に失敗しました:', error);
      });
        
  if(!currentAvatarImgUrl){
      // ユーザーの現在のアバター画像を取得
        // axios.get('/users/' + userId)
        // .then(userRes => {
        //     const avatarId = userRes.data.avatarId;
        //     return axios.get('/api/avatars/' + avatarId, {responseType: 'blob'});
        // })
        // .then(bgRes => {
        //     const blob = bgRes.data;
        //     const imageUrl = URL.createObjectURL(blob);
        //     setAvatarUrl(imageUrl);
        //     this.setState({
        //         currentAvatarImgUrl: imageUrl
        //     });
        // })
        // .catch(error => {
        //   console.error('avatar画像の取得に失敗しました:', error);
        // })
        this.setAvatar(userId)
    }
 

  }

  setAvatar = (userId) => {
    const {setAvatarUrl} = this.state;
    axios.get('/users/' + userId)
        .then(userRes => {
            const avatarId = userRes.data.avatarId;
            return axios.get('/api/avatars/' + avatarId, {responseType: 'blob'});
        })
        .then(bgRes => {
            const blob = bgRes.data;
            const imageUrl = URL.createObjectURL(blob);
            setAvatarUrl(imageUrl);
            this.setState({
                currentAvatarImgUrl: imageUrl
            });
        })
        .catch(error => {
          console.error('avatar画像の取得に失敗しました:', error);
        })
  }

  openModal = () => {
        this.setState({
            showModal: true
        });
    };

  closeModal = () => {
      this.setState({ showModal: false});
  };

  handleAvatarSelect = (imgId) => {
    const {userId} = this.state;

    axios.get("/users/" + userId)
      .then(json => {
        json.data.avatarId = imgId;
        return json.data
      })
      .then(json => {
        axios.post("/users", json)
          .then(json => {
            console.log(json.data);
          })
          .catch(error => {
            console.error('ユーザー情報の更新に失敗しました:', error);
          });
      })
      .then(_=> {this.setAvatar(userId)})
      .then(_=> {this.setState({showModal: false})})
  }



  render() {
    const {avatarImgUrlImgIdList, currentAvatarImgUrl, showModal} = this.state;
    return (
      <div>
        <img
          src={currentAvatarImgUrl || null}
          alt="アバター画像がありません。localhost:3000/testからアップロードしてね"
          className="avatar"
          onClick={this.openModal}
        />

        {/* アバター選択のモーダル表示 */}
        {showModal && (
            <div id='modal'>
              <div id='modalContent-avatar'>
                <h3>好きなアバターを選択してね</h3>
                <div className="avatar-list">
                  {avatarImgUrlImgIdList.map((url_id, index) => (
                    <img
                      key={index}
                      src={url_id[0]}
                      alt={`アバター${index + 1}`}
                      className="avatar"
                      onClick={() => this.handleAvatarSelect(url_id[1])}
                    />
                  ))}
                </div>
                <button onClick={this.closeModal}>閉じる</button>
              </div>
          </div>
        )}
      </div>
    );
  }
};

export default (Avatar);