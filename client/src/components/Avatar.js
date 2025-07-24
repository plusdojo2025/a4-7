import React from "react";
import axios from 'axios';
import "./SugorokuCell.css"; 

export default class Avatar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userId:1,
      avatarImgUrlList: [],
      currentAvatarImgUrl: "",
      showModal: false
    }
  }

  componentDidMount = () => {
    const {userId} = this.state;


      // avatar画像を全取得
      axios.get('/user-images/useravatar/' + userId)
      .then(json => {
        const imageIdList = [];
        console.log(json.data)     
        for (let uImgs of json.data) {
          imageIdList.push(uImgs.imageId);
        }
  
        for (let imgId of imageIdList) {
          axios.get('/api/avatars/'+imgId, {responseType: 'blob'})
          .then(blob => {
            const imageUrl = URL.createObjectURL(blob.data);
            this.setState({
              avatarImgUrlList: [...this.state.avatarImgUrlList, imageUrl]
            })
          })
          .catch(error => {
          console.error('avatar画像の取得に失敗しました:', error);
      })
        }
      })
      .catch(error => {
          console.error('avatar画像の取得に失敗しました:', error);
      })
        
  
      // ユーザーの現在のアバター画像を取得
        axios.get('/users/' + userId)
        .then(userRes => {
            const avatarId = userRes.data.avatarId;
            return axios.get('/api/avatars/' + avatarId, {responseType: 'blob'});
        })
        .then(bgRes => {
            const blob = bgRes.data;
            const imageUrl = URL.createObjectURL(blob);
            this.setState({
                currentAvatarImgUrl: imageUrl
            });
        })
        .catch(error => {
          console.error('avatar画像の取得に失敗しました:', error);
        })
 

  }

  render() {
    const {avatarImgUrlList, currentAvatarImgUrl, showModal} = this.state;
    return (
      <div>
        <img src={currentAvatarImgUrl} alt="アバター画像がありません。localhost:3000/testからアップロードしてね" className="avatar" />
        {/* アバター選択のモーダル表示 */}
        {showModal && (
          <div></div>
        )}
      </div>
    );
  }
};

