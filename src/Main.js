import axios from 'axios'
import React from 'react';

class Main extends React.Component {
    state = {
      tvload: [],
      curTvload: {
        show:{
          id:1,
          language: 'Language',
          genres: [],
          image: {
            original: 'https://via.placeholder.com/210x295/111217/FFFFFF/?text=No%20Image'
          },
          network: {
            name: 'Network',
            country: {name: 'Country'}
          }
        }
      },
      searchTerm: '',
      showPopup: false,
    }
    
    componentDidMount(){
      axios.get(`https://api.tvmaze.com/search/shows?q=all`)
      .then(response => {
        console.clear();
        console.log(response.data);
        this.setState({
          ...this.state,
          tvload: response.data,
        });
        
        console.log(this.state.tvload);
      });
    }
    
    fetchShows = () => {
      const term = this.state.searchTerm;
      
      axios.get(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(term)}`)
      .then(response => {
        console.clear();
        console.log(response.data);
        this.setState({
          ...this.state,
          tvload: response.data,
        });
        
        console.log(this.state.tvload);
      });
      
      this.printShows();
    }
    
    storeInputValue = (value) => {
      this.setState((state) => ({
        ...state,
        searchTerm: value
      }));
      
      console.log(this.state.searchTerm);
    }
    
    printShows = () => {
      let allShows = [];
      this.state.tvload.map(title => {
        allShows.push(<Show 
                        key={title.show.id} 
                        id={title.show.id} 
                        showClicked={this.getClick}
                        imgLink={title.show.image === null ? 'https://via.placeholder.com/210x295/111217/FFFFFF/?text=No%20Image' : title.show.image.medium}
                        />);
      });
      
      return allShows;
    }
    
    getClick = (id) => {
      console.log('Clicked ' + id);
      let curShow = this.state.tvload.find(title => title.show.id == id);
      this.setState({
        ...this.state,
        showPopup: true,
        curTvload: curShow
      });
      console.log(this.state.curTvload);
    }
    
    shutPop = () => {
      this.setState({
        ...this.state,
        showPopup: false,
      })
    }
    
    render() {
      let allShows = this.printShows();
      return (
        <div className='main'>
          { this.state.showPopup && 
            <Showexpand 
              closePop={this.shutPop}
            name={this.state.curTvload.show.name}
            imgLink={
              this.state.curTvload.show.image == null ?
              'https://via.placeholder.com/210x295/111217/FFFFFF/?text=No%20Image' : 
              this.state.curTvload.show.image.original
            }
            country={this.state.curTvload.show.network == null ?
              '' : this.state.curTvload.show.network.country.name }
            lang={this.state.curTvload.show.language}
            genres={this.state.curTvload.show.genres.join(', ')}
            plot={this.state.curTvload.show.summary}
            network={this.state.curTvload.show.network == null ?
              'N/A' : this.state.curTvload.show.network.name }
            runtime={this.state.curTvload.show.runtime}
            rating={this.state.curTvload.show.rating == null ?
              'N/A' : this.state.curTvload.show.rating.average }
            status={this.state.curTvload.show.status}
            link={this.state.curTvload.show.url}
            />
          }
          
          <Search 
            getInputValue={this.storeInputValue} 
            getSubmit={this.fetchShows}
            sendEnter={this.fetchShows}
            />
          <div className='show-grid'>
            { allShows.length === 0 ? <div className='error'>No shows found... <i class="fas fa-film"></i></div> : allShows }
          </div>
        </div>
      )
    }
  }
  
  
  // Search component -------------------------
  const Search = (props) => {
  
    let sendValue = (e) => {
      props.getInputValue(e.target.value)
    }
    
    const handleSubmit = () => {
      props.getSubmit();
    }
    
    const handleKeyDown = (e) => {
      if(e.key === 'Enter'){
        props.sendEnter();
        console.log('Enter');
      }
    }
    
    return(
      <div className='search'>
        <div className='search-box'>
          <input type='text' onChange={sendValue} onKeyDown={handleKeyDown} placeholder='Enter word...' />
          <button onClick={handleSubmit} ><i class="fas fa-search"></i></button>
        </div>
      </div>
    )
  }
  
  
  // Show component ---------------------------------------
  const Show = (props) => {
    
    let handleShowClick = (e) => {
      props.showClicked(e.target.dataset.id);
    }
    
    return (
      <div className='show' 
        id={props.id} 
        data-id={props.id} 
        onClick={handleShowClick} >
        
        <img src={props.imgLink} data-id={props.id} />
      </div>
    )
  }
  
  
  // Show expand component ---------------------------------------
  const Showexpand = (props) => {
    
    return (
      <div className='show-expand'>
        
        <div className='show-content'>
          <i class="show-close fas fa-times" onClick={props.closePop} ></i>
          
          <div className='show-poster'>
            <span className='show-poster-bg'>
              <img src={props.imgLink} alt={props.name} />
            </span>
            <span className='show-poster-main'>
              <img src={props.imgLink} alt={props.name} />
            </span>
          </div>
          
          <div className='show-detail'>
            <h2>{props.name}</h2>
            <ul className="show-tags">
              <li className="show-rated">{props.country}</li>
              <li className="show-year">{props.lang}</li>
              <li className="show-year">{props.genres}</li>
            </ul>
            <div class="show-plot" dangerouslySetInnerHTML={{__html: props.plot }}>
            </div>
            
            <div class="show-credits">
              <p><strong>Network:</strong> {props.network}</p>
              <p><strong>Runtime:</strong> {props.runtime || 'N/A '}mins</p>
              <p><strong>Rating:</strong> {props.rating}</p>
              <p><strong>Status:</strong> {props.status}</p>
              <a href={props.link} target='_blank'>
                More info 
                <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
          
        </div>
      </div>
    )
  }

  export default Main
  