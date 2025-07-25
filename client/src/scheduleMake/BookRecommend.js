import React from "react";
//import './BookRecommend.css';

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
            authorInfo:'',
            overviewInfo:'',
            pagesInfo:'',
            indexInfo:'',
            imageUrlTemp:""
        }
    }

    componentDidMount(){
        fetch("/book/grade1/")
        .then(res=>res.json())
        .then(json=>{
            console.log(json)
            this.setState({
                books1:json,
                imageUrlTemp: URL.createObjectURL(json.imageData)
            })
        });
        
        fetch("/book/grade2/")
        .then(res=>res.json())
        .then(json=>{
            console.log(json)
            this.setState({
                books2:json
            })
        });
        fetch("/book/grade3/")
        .then(res=>res.json())
        .then(json=>{
            console.log(json)
            this.setState({
                books3:json
            })
        });
        fetch("/book/grade4/")
        .then(res=>res.json())
        .then(json=>{
            console.log(json)
            this.setState({
                books4:json
            })
        });
        fetch("/book/grade5/")
        .then(res=>res.json())
        .then(json=>{
            console.log(json)
            this.setState({
                books5:json
            })
        });
        fetch("/book/grade6/")
        .then(res=>res.json())
        .then(json=>{
            console.log(json)
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
            authorInfo:this.state.books1[index].author,
            overviewInfo:this.state.books1[index].overview,
            pagesInfo:this.state.books1[index].pages,
            indexInfo:index
        })
        const{isVisible1}=this.state;
        this.setState({
        isVisible1:!isVisible1
        });
    }

    clickEvent2(index){
        this.setState({
            authorInfo:this.state.books2[index].author,
            overviewInfo:this.state.books2[index].overview,
            pagesInfo:this.state.books2[index].pages,
            indexInfo:index
        })
        const{isVisible2}=this.state;
        this.setState({
            isVisible2:!isVisible2
        });
    }

    clickEvent3(index){
        this.setState({
            authorInfo:this.state.books3[index].author,
            overviewInfo:this.state.books3[index].overview,
            pagesInfo:this.state.books3[index].pages,
            indexInfo:index
        })
        const{isVisible3}=this.state;
        this.setState({
            isVisible3:!isVisible3
        });
    }

    clickEvent4(index){
        this.setState({
            authorInfo:this.state.books4[index].author,
            overviewInfo:this.state.books4[index].overview,
            pagesInfo:this.state.books4[index].pages,
            indexInfo:index
        })
        const{isVisible4}=this.state;
        this.setState({
            isVisible4:!isVisible4
        });
    }

    clickEvent5(index){
        this.setState({
            authorInfo:this.state.books5[index].author,
            overviewInfo:this.state.books5[index].overview,
            pagesInfo:this.state.books5[index].pages,
            indexInfo:index
        })
        const{isVisible5}=this.state;
        this.setState({
            isVisible5:!isVisible5
        });
    }

    clickEvent6(index){
        this.setState({
            authorInfo:this.state.books6[index].author,
            overviewInfo:this.state.books6[index].overview,
            pagesInfo:this.state.books6[index].pages,
            indexInfo:index
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
                <button onClick={this.toggleModal}>本を選ぶ</button>
                {showModal &&
                    <div>
                        <div id="grade1">
                            <p>1年生向け</p>
                            {books1.map((book,index)=>
                                <div>
                                     {/* <button onClick={() => this.clickEvent1(index)}><img src="{book.ImageData}"></img></button> */}
                                     <button onClick={() => this.clickEvent1(index)}><img src="{this.state.imageUrlTemp}"></img></button>
                                    <p>{book.name}</p>
                                </div>
                            )}
                            {this.state.isVisible1 && 
                                 <ul>
                                    <li>著者:{this.state.authorInfo}</li>
                                    <li>概要:{this.state.overviewInfo}</li>
                                    <li>ページ数:{this.state.pagesInfo}</li>
                                </ul>
                            }
                        </div>
                        <div id="grade2">
                            <p>2年生向け</p>
                            {books2.map((book,index)=>
                                <div>
                                    <button onClick={()=>this.clickEvent2(index)}>{book.image}</button>
                                    <p>{book.name}</p>
                                </div>
                            )}
                            {this.state.isVisible2 && 
                                 <ul>
                                    <li>著者:{this.state.authorInfo}</li>
                                    <li>概要:{this.state.overviewInfo}</li>
                                    <li>ページ数:{this.state.pagesInfo}</li>
                                </ul>
                            }
                        </div>
                        <div id="grade3">
                            <p>3年生向け</p>
                            {books3.map((book,index)=>
                                <div>
                                    <button onClick={()=>this.clickEvent3(index)}>{book.image}</button>
                                    <p>{book.name}</p>
                                </div>
                            )}
                            {this.state.isVisible3 && 
                                 <ul>
                                    <li>著者:{this.state.authorInfo}</li>
                                    <li>概要:{this.state.overviewInfo}</li>
                                    <li>ページ数:{this.state.pagesInfo}</li>
                                </ul>
                            }
                        </div>
                        <div id="grade4">
                            <p>4年生向け</p>
                            {books4.map((book,index)=>
                                <div>
                                    <button onClick={()=>this.clickEvent4(index)}>{book.image}</button>
                                    <p>{book.name}</p>
                                </div>
                            )}
                            {this.state.isVisible4 && 
                                 <ul>
                                    <li>著者:{this.state.authorInfo}</li>
                                    <li>概要:{this.state.overviewInfo}</li>
                                    <li>ページ数:{this.state.pagesInfo}</li>
                                </ul>
                            }
                        </div>
                        <div id="grade5">
                            <p>5年生向け</p>
                            {books5.map((book,index)=>
                                <div>
                                    <button onClick={()=>this.clickEvent5(index)}>{book.image}</button>
                                    <p>{book.name}</p>
                                </div>
                            )}
                            {this.state.isVisible5 && 
                                 <ul>
                                    <li>著者:{this.state.authorInfo}</li>
                                    <li>概要:{this.state.overviewInfo}</li>
                                    <li>ページ数:{this.state.pagesInfo}</li>
                                </ul>
                            }
                        </div>
                        <div id="grade6">
                            <p>6年生向け</p>
                            {books6.map((book,index)=>
                                <div>
                                    <button onClick={()=>this.clickEvent6(index)}>{book.image}</button>
                                    <p>{book.name}</p>
                                </div>
                            )}
                            {this.state.isVisible6 && 
                                 <ul>
                                    <li>著者:{this.state.authorInfo}</li>
                                    <li>概要:{this.state.overviewInfo}</li>
                                    <li>ページ数:{this.state.pagesInfo}</li>
                                </ul>
                            }
                        </div>
                        <button onClick={this.toggleModal}>閉じる</button>
                    </div>
                }
            </div>
        );
    }
}