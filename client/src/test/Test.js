import React from 'react';
import axios from 'axios';

export default class Test extends React.Component {

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
        </div>
        );
    }
}