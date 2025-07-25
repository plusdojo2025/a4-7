import React from "react";
import './BookRecommend.css';

export default class BookRecommend extends React.Component{
    constructor(props){
        super(props);
        this.state={
            books1:[],
            books2:[],
            books3:[],
            books4:[],
            books5:[],
            books6:[],
            name:"",
            author:"",
            overview:"",
            pages:"",
            ImageData:"",
            grade:"",
            showModal:false,
            isVisible1:false,
            isVisible2:false,
            isVisible3:false,
            isVisible4:false,
            isVisible5:false,
            isVisible6:false,
            authorInfo1:'',
            overviewInfo1:'',
            pagesInfo1:'',
            indexInfo1:'',
            authorInfo2:'',
            overviewInfo2:'',
            pagesInfo2:'',
            indexInfo2:'',
            authorInfo3:'',
            overviewInfo3:'',
            pagesInfo3:'',
            indexInfo3:'',
            authorInfo4:'',
            overviewInfo4:'',
            pagesInfo4:'',
            indexInfo4:'',
            authorInfo5:'',
            overviewInfo5:'',
            pagesInfo5:'',
            indexInfo5:'',
            authorInfo6:'',
            overviewInfo6:'',
            pagesInfo6:'',
            indexInfo6:'',
            imageUrlTemp:""
        }
    }

    // jsonデータからblob形式に変換し、blobから画像を再構成
    ImageData2imageUrl = (imageData) => {
        const base64String = imageData.body;
        const mimeType = imageData.headers["Content-Type"][0];
        const byteCharacters = atob(base64String);
        const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const imageUrl = URL.createObjectURL(blob);
        return imageUrl;
    }

    componentDidMount(){
        fetch("/book/grade1/")
        .then(res=>res.json())
        .then(json=>{
            console.log(json)

            json.map((book, idx) => {
                const imageUrl = this.ImageData2imageUrl(book.ImageData)
                json[idx].ImageData = imageUrl
            })         
            
            this.setState({
                books1:json
            })
        });
        
        fetch("/book/grade2/")
        .then(res=>res.json())
        .then(json=>{
            console.log(json)
            json.map((book, idx) => {
                const imageUrl = this.ImageData2imageUrl(book.ImageData)
                json[idx].ImageData = imageUrl
            })     
            this.setState({
                books2:json
            })
        });
        fetch("/book/grade3/")
        .then(res=>res.json())
        .then(json=>{
            console.log(json)
            json.map((book, idx) => {
                const imageUrl = this.ImageData2imageUrl(book.ImageData)
                json[idx].ImageData = imageUrl
            })     
            this.setState({
                books3:json
            })
        });
        fetch("/book/grade4/")
        .then(res=>res.json())
        .then(json=>{
            console.log(json)
            json.map((book, idx) => {
                const imageUrl = this.ImageData2imageUrl(book.ImageData)
                json[idx].ImageData = imageUrl
            })     
            this.setState({
                books4:json
            })
        });
        fetch("/book/grade5/")
        .then(res=>res.json())
        .then(json=>{
            console.log(json)
            json.map((book, idx) => {
                const imageUrl = this.ImageData2imageUrl(book.ImageData)
                json[idx].ImageData = imageUrl
            })     
            this.setState({
                books5:json
            })
        });
        fetch("/book/grade6/")
        .then(res=>res.json())
        .then(json=>{
            console.log(json)
            json.map((book, idx) => {
                const imageUrl = this.ImageData2imageUrl(book.ImageData)
                json[idx].ImageData = imageUrl
            })     
            this.setState({
                books6:json
            })
        });
    }

    toggleModal=()=>{
    const{showModal}=this.state;
    this.setState({
        showModal:!showModal
    });
    }

    clickEvent1(index){
        this.setState({
            authorInfo1:this.state.books1[index].author,
            overviewInfo1:this.state.books1[index].overview,
            pagesInfo1:this.state.books1[index].pages,
            indexInfo1:index
        })
        const{isVisible1}=this.state;
        this.setState({
        isVisible1:!isVisible1
        });
    }

    clickEvent2(index){
        this.setState({
            authorInfo2:this.state.books2[index].author,
            overviewInfo2:this.state.books2[index].overview,
            pagesInfo2:this.state.books2[index].pages,
            indexInfo2:index
        })
        const{isVisible2}=this.state;
        this.setState({
            isVisible2:!isVisible2
        });
    }

    clickEvent3(index){
        this.setState({
            authorInfo3:this.state.books3[index].author,
            overviewInfo3:this.state.books3[index].overview,
            pagesInfo3:this.state.books3[index].pages,
            indexInfo3:index
        })
        const{isVisible3}=this.state;
        this.setState({
            isVisible3:!isVisible3
        });
    }

    clickEvent4(index){
        this.setState({
            authorInfo4:this.state.books4[index].author,
            overviewInfo4:this.state.books4[index].overview,
            pagesInfo4:this.state.books4[index].pages,
            indexInfo4:index
        })
        const{isVisible4}=this.state;
        this.setState({
            isVisible4:!isVisible4
        });
    }

    clickEvent5(index){
        this.setState({
            authorInfo5:this.state.books5[index].author,
            overviewInfo5:this.state.books5[index].overview,
            pagesInfo5:this.state.books5[index].pages,
            indexInfo5:index
        })
        const{isVisible5}=this.state;
        this.setState({
            isVisible5:!isVisible5
        });
    }

    clickEvent6(index){
        this.setState({
            authorInfo6:this.state.books6[index].author,
            overviewInfo6:this.state.books6[index].overview,
            pagesInfo6:this.state.books6[index].pages,
            indexInfo6:index
        })
        const{isVisible6}=this.state;
        this.setState({
            isVisible6:!isVisible6
        });
    }

    //本の画像をクリックしたら詳細がひらく→別の本がクリックされたらそこの欄を上書きする、にしたい（学年ごとに）今だと多分一冊目の詳細ひらく→そのまま2冊目を押すと一回閉じる、もう一回押すとひらく、かな？最悪これでもいいけど
    render(){
        const{books1,books2,books3,books4,books5,books6,showModal}=this.state;

        return(
            <div>
                {/*<button onClick={this.toggleModal}>本を選ぶ</button>
                {showModal &&*/}
                    <div>
                        <div id="grade1">
                            <div class="forgrade">
                            <p>1年生向け</p>
                            </div>
                            <div class="booklist">
                            {books1.map((book,index)=>
                                <div class="eachbook">
                                     <button class="bookbutton" onClick={() => this.clickEvent1(index)}><img src={book.ImageData} class="bookimg"></img></button>
                                     {/* <button onClick={() => this.clickEvent1(index)}><img src={this.state.imageUrlTemp}></img></button> */}
                                    <p>{book.name}</p>
                                </div>
                            )}
                            </div>
                            {this.state.isVisible1 && 
                                 <ul>
                                    <li>著者:{this.state.authorInfo1}</li>
                                    <li>{this.state.overviewInfo1}</li>
                                    <li>ページ数:{this.state.pagesInfo1}</li>
                                </ul>
                            }
                        </div>
                        <div id="grade2">
                            <div class="forgrade">
                            <p>2年生向け</p>
                            </div>
                            <div class="booklist">
                            {books2.map((book,index)=>
                                <div>
                                    <button class="bookbutton" onClick={()=>this.clickEvent2(index)}><img src={book.ImageData} class="bookimg"></img></button>
                                    <p>{book.name}</p>
                                </div>
                            )}
                            </div>
                            {this.state.isVisible2 && 
                                 <ul>
                                    <li>著者:{this.state.authorInfo2}</li>
                                    <li>{this.state.overviewInfo2}</li>
                                    <li>ページ数:{this.state.pagesInfo2}</li>
                                </ul>
                            }
                        </div>
                        <div id="grade3">
                            <div class="forgrade">
                            <p>3年生向け</p>
                            </div>
                            <div class="booklist">
                            {books3.map((book,index)=>
                                <div>
                                    <button class="bookbutton" onClick={()=>this.clickEvent3(index)}><img src={book.ImageData} class="bookimg"></img></button>
                                    <p>{book.name}</p>
                                </div>
                            )}
                            </div>
                            {this.state.isVisible3 && 
                                 <ul>
                                    <li>著者:{this.state.authorInfo3}</li>
                                    <li>{this.state.overviewInfo3}</li>
                                    <li>ページ数:{this.state.pagesInfo3}</li>
                                </ul>
                            }
                        </div>
                        <div id="grade4">
                            <div class="forgrade">
                            <p>4年生向け</p>
                            </div>
                            <div class="booklist">
                            {books4.map((book,index)=>
                                <div>
                                    <button class="bookbutton" onClick={()=>this.clickEvent4(index)}><img src={book.ImageData} class="bookimg"></img></button>
                                    <p>{book.name}</p>
                                </div>
                            )}
                            </div>
                            {this.state.isVisible4 && 
                                 <ul>
                                    <li>著者:{this.state.authorInfo4}</li>
                                    <li>{this.state.overviewInfo4}</li>
                                    <li>ページ数:{this.state.pagesInfo4}</li>
                                </ul>
                            }
                        </div>
                        <div id="grade5">
                            <div class="forgrade">
                            <p>5年生向け</p>
                            </div>
                            <div class="booklist">
                            {books5.map((book,index)=>
                                <div>
                                    <button class="bookbutton" onClick={()=>this.clickEvent5(index)}><img src={book.ImageData} class="bookimg"></img></button>
                                    <p>{book.name}</p>
                                </div>
                            )}
                            </div>
                            {this.state.isVisible5 && 
                                 <ul>
                                    <li>著者:{this.state.authorInfo5}</li>
                                    <li>{this.state.overviewInfo5}</li>
                                    <li>ページ数:{this.state.pagesInfo5}</li>
                                </ul>
                            }
                        </div>
                        <div id="grade6">
                            <div class="forgrade">
                            <p>6年生向け</p>
                            </div>
                            <div class="booklist">
                            {books6.map((book,index)=>
                                <div>
                                    <button class="bookbutton" onClick={()=>this.clickEvent6(index)}><img src={book.ImageData} class="bookimg"></img></button>
                                    <p>{book.name}</p>
                                </div>
                            )}
                            </div>
                            {this.state.isVisible6 && 
                                 <ul>
                                    <li>著者:{this.state.authorInfo6}</li>
                                    <li>{this.state.overviewInfo6}</li>
                                    <li>ページ数:{this.state.pagesInfo6}</li>
                                </ul>
                            }
                        </div>
                        {/*<button onClick={this.toggleModal}>閉じる</button>*/}
                    </div>
                {/*}*/}
            </div>
        );
    }
}