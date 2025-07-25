import React from 'react';
import axios from 'axios';

export default class Test extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      inputId: '',
      inputImage: null 
    };
    this.handleChangeId = this.handleChangeId.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleBookImageUpload = this.handleBookImageUpload.bind(this);
}



    handleBgImageUpload = () => {
        const fileInput = document.querySelector('input[type="file"]#bgImageInput');
        const files = fileInput.files;
        if (files.length === 0) {
            console.error('アップロードするファイルが選択されていません。');
            return;
        }
        Array.from(files).forEach(file => {
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            axios.post('/backgrounds', formData)
            .then(response => {
                console.log('アップロード成功！:', response.data);
            })
            .catch(error => {
                console.error('アップロード失敗...:', error);
            });
        }
        })
    }

    handleAvatarImageUpload = () => {
        const fileInput = document.querySelector('input[type="file"]#avatarImageInput');
        const files = fileInput.files;
        if (files.length === 0) {
            console.error('アップロードするファイルが選択されていません。');
            return;
        }
        Array.from(files).forEach(file => {
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            axios.post('/api/avatars', formData)
            .then(response => {
                console.log('アップロード成功！:', response.data);
            })
            .catch(error => {
                console.error('アップロード失敗...:', error);
            });
        }
        })
    }

handleChangeId(event) {
    this.setState({ inputId: event.target.value });
  }
handleChangeImage(event) {
    this.setState({ inputImage: event.target.value });
  }

async handleBookImageUpload(){
        const {inputId,inputImage}=this.state;
        const fileInput = document.querySelector('input[type="file"]#bookImageInput');
        const files = fileInput.files[0];
        if (inputId!=null&&inputImage!=null) {
            const formData = new FormData();
            formData.append('id',inputId);
            // formData.append('image', inputImage);
            formData.append('image', files);
            console.log(inputImage);
            axios.post('/book/',formData)
            .then(response => {
                console.log('アップロード成功！:', response.data);
            })
            .catch(error => {
                console.error('アップロード失敗...:', error);
            });
        }
    }


    render() {
        return (
        <div>
            <h3>背景画像アップロード</h3>
            <input type="file" accept="image/*" multiple id='bgImageInput'/>
            <button onClick={this.handleBgImageUpload}>アップロード</button>

            <h3>アバター画像アップロード</h3>
            <input type="file" accept="image/*" multiple id='avatarImageInput'/>
            <button onClick={this.handleAvatarImageUpload}>アップロード</button>
            <h3>本画像アップロード</h3>
            ID<input type="text" id="bookIdInput" value={this.state.inputId} onChange={this.handleChangeId}/><br></br>
            <input type="file" accept="image/*" value={this.state.inputImage} onChange={this.handleChangeImage} id='bookImageInput'/>
            <button onClick={this.handleBookImageUpload}>アップロード</button>
        </div>

        
        );
    }
}