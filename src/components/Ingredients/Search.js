import React,{useState,useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const {onFilteringData} = props;
  const [enteredFilter,setenteredFilter] =useState('');
  const inputref = useRef();

useEffect(()=>{
  const timer = setTimeout(()=>
  {
    if(enteredFilter === inputref.current.value)
    {
  console.log("called");
  const queryParams = enteredFilter.length === 0 ? '': `?orderBy="title"&equalTo="${enteredFilter}"`;
  fetch('https://reacthook-cb5b7.firebaseio.com/ingredients.json' + queryParams)
  .then(response=> response.json())
  .then(responseData => 
   { 
     const loaeddata = [];
     for (const key in responseData){
      loaeddata.push({
        id: key,
        title: responseData[key].title,
        amount: responseData[key].amount
      })
    }
    console.log(loaeddata)
    onFilteringData(loaeddata);
  })}},500);
  return (()=>{
    clearTimeout(timer);
  })
},[enteredFilter, onFilteringData]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
          ref={inputref}
          type="text" value={enteredFilter} 
          onChange={event=>setenteredFilter(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
