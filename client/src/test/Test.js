import React from 'react';
import axios from 'axios';

export default class Test extends React.Component {

    constructor(props) {
        super(props);
    }

    handleBgImageUpload = () => {
        const file = document.querySelector('input[type="file"]#bgImageInput').files[0];
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
    }

    render() {
        return (
        <div>
            <h3>背景画像アップロード</h3>
            <input type="file" accept="image/*" id='bgImageInput'/>
            <button onClick={this.handleBgImageUpload}>アップロード</button>

            <h3>アバター画像アップロード</h3>
            <h3>本画像アップロード</h3>
        </div>
        );
    }
}