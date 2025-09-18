import React from 'react'; 
import './App.css';
import axios from 'axios';

function App() {
  const currentYear = new Date().getFullYear();
  const [countItems, setCountItems] = React.useState(0);
  const [years, setYears] = React.useState([]);
  const [items, setItems] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [selectedYear, setSelectedYear] = React.useState({start: currentYear + "0101", end: currentYear + "1231"});
  const [inputValue, setInputValue] = React.useState("");
  // const [error, setError] = React.useState(false);

  async function search(query, date, page) {
    try {
      const res = await axios.get(`https://www.googleapis.com/customsearch/v1?key=AIzaSyBnLgCGQfNcMhFfwpYdf0hAk-2_MNQutzY&cx=1077d942213e24ead&q=${query}&start=${page}&num=10&sort=date:r:${date.start}:${date.end}`);
      if(res.status === 200){
        setItems(res.data.items);
        setCountItems(res.data.queries.request[0].count);
      }
    } catch (err) {
      // setError(true);
      return err;
    }
  }

  function getYearsArray(currentYear) {
    
    let array = [];
    for (let year = currentYear; year >= 2016; year--) {
      array.push(year);
    }

    setYears(array);
  }

  React.useEffect(() => {
    getYearsArray(currentYear);
  }, [currentYear]);

  return (
    <div className="App">
      <div className='advertisment'></div>
      <form className='search_form'>
        <input className='search_input' placeholder='enter key words' value={inputValue} onChange={(event) => setInputValue(event.target.value)}></input>
        <button className='submit_button' type='submit' onClick={(event) => {event.preventDefault(); search(inputValue, selectedYear, page)}}>Search</button>
      </form>
      <div className='date_slider'>
        {
          years ?
            years.map((item) => {
              return (
                <p className="year_button" key={item} onClick={() => {
                  search(inputValue, {start: item + "0101", end: item + "1231"}, 1);
                  setSelectedYear({start: item + "0101", end: item + "1231"});
                  setPage(1);
                }}>{item}</p>
              )
            })
          : null
        }
      </div>
      <div className='item_wrap'>
        {
          items ?
            items.map((item) => {
              return (
                <p className='item' key={item.link}><a href={item.link}>{item.title}</a></p>
              )
            })
          : <p className='error_text'>Articles not found</p>
        }
      </div>

      <div className='pagination_wrap'>
        {
          page === 1 ?
          null :
          <p onClick={() => {
            setPage(page - 10);
            search(inputValue, selectedYear, page - 10);
          }}>Previus page</p>
        }
        {
          page === 91 || countItems < 10 ?  
          null : 
          <p onClick={() => {
            setPage(page + 10);
            search(inputValue, selectedYear, page + 10);
          }}>Next page</p>
        }
      </div>
    </div>
  );
}

export default App;
