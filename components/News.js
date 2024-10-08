import React, { useEffect,useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
const News = (props) =>{
    const[articles,setArticles] = useState([]);
    const[loading,setLoading] = useState(true);
    const[page,setPage] = useState(1);
    const[totalResults,setTotalResults] = useState(0);
    
    
    const CapitalizeString = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const updateNews = async() =>{
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=324c20ce9898469bbdfc0c4802a8f161&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true);
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json();
        props.setProgress(70);
        setArticles(parsedData.articles);
        setTotalResults(parsedData.totalResults);
        setLoading(false);
        props.setProgress(100);
    }

    useEffect(() =>{
        updateNews();
        document.title = `${CapitalizeString(props.category)} - NewsMonkey`
    },[])
    // async componentDidMount() // This is used when you want to render this component at last after rendering content under render function
    // {
    //     this.updateNews();
    // }
    const handlePreviousClick = async () => {
        console.log("Previous");

        // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=324c20ce9898469bbdfc0c4802a8f161&page=${this.state.page - 1}&pageSize=${props.pageSize}`;
        // this.setState({ loading: true });
        // let data = await fetch(url);
        // let parsedData = await data.json();
        // console.log(parsedData);
        // this.setState({
        //     page: this.state.page - 1,
        //     articles: parsedData.articles,
        //     loading: false
        // })
        setPage(page-1);
        updateNews();
    }

    const handleNextClick = async () => {
        console.log("Next");
        // if(!(this.state.page + 1 > Math.ceil(this.state.totalResults/props.pageSize)))
        // {

        // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=324c20ce9898469bbdfc0c4802a8f161&page=${this.state.page+1}&pageSize=${props.pageSize}`;
        // this.setState({loading:true});
        // let data = await fetch(url);
        // let parsedData = await data.json();
        // console.log(parsedData);
        // this.setState({
        //     page: this.state.page + 1,
        //     articles: parsedData.articles,
        //     loading: false
        // })

        //}
        setPage(page+1);
        updateNews();
    }
    const fetchMoreData = async() =>{
        
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=324c20ce9898469bbdfc0c4802a8f161&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page+1);
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults);
    }
    
        return (
            <>
                <h1 className="text-center" style={{ margin: "35px 0px",marginTop:"90px" }}>NewsMonkey - Top {CapitalizeString(props.category)} Headlines </h1>
                {loading && <Spinner />}
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !==  totalResults}
                    loader={<Spinner/>}
                >
                    <div className="container">
                    <div className="row">
                        {articles.map((element) => {
                            return <div className='col-md-4' key={element.url}>
                                <NewsItem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 88) : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s".slice(0, 88)} imageUrl={element.urlToImage ? element.urlToImage : "https://www.shutterstock.com/image-vector/breaking-news-background-world-global-260nw-719766118.jpg"} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>
                    </div>
                </InfiniteScroll>
                {/* <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page <= 1} onClick={this.handlePreviousClick} type="button" class="btn btn-dark">&larr; Previous</button>
                    <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / props.pageSize)} onClick={this.handleNextClick} type="button" class="btn btn-dark">Next &rarr;</button>
                </div> */}
            </>
        )
    
}

News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: "general"
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}
export default News
