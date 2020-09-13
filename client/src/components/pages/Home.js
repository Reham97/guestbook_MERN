import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'

const Home = () => {
  const [data, setData] = useState([])
  const [comments, setComments] = useState([])
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    fetch('/allevents', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("guestBook-jwt")
      }
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        setData(result.events)
      })
  }, [])

  const deleteEvent = (eventid) => {
    fetch(`/deleteevent/${eventid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("guestBook-jwt")
      }
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        const newData = data.filter(item => {
          return item._id !== result._id
        })
        setData(newData)
      })
  }


  const makeComment = (text, eventId) => {
    fetch('/comment', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("guestBook-jwt")
      },
      body: JSON.stringify({
        eventId,
        text
      })
    }).then(res => res.json())
      .then(result => {
        const newData = data.map(item => {
          if (item._id == result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      }).catch(err => {
        console.log(err)
      })
  }

  const deleteComment = (commentid) => {
    fetch(`/deletecomment/${commentid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("guestBook-jwt")
      }
    }).then(res => res.json())
      .then(result => {
        fetch('/allevents', {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("guestBook-jwt")
          }
        }).then(res => res.json())
          .then(result => {
            console.log(result)
            setData(result.events)
          })
      })
  }


  return (
    <div className="home">
      {
        data.map(item => {
          return (
            <div className="card home-card" key={item._id}>
              {item.postedBy._id == state._id
                ? <i className="material-icons hand" style={{
                  float: "right"
                }}
                  onClick={() => deleteEvent(item._id)}
                >delete</i>

                : <></>
              }

              <h5 style={{ padding: "5px" }}>
                <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>
                  {item.postedBy.name}
                </Link>
              </h5>

              <div className="card-image">
                <img src={item.photo} />
              </div>
              <div className="card-content">





                <h3><small>Title: </small>{item.title}</h3>
                <h5><small>Description: </small>{item.body}</h5>
                <h6>comments:</h6>

                {
                  item.comments.map(record => {
                    return (
                      <h6 key={record._id}><span style={{ fontWeight: "500" }}>({record.postedBy.name}) 
                         {record.postedBy._id == state._id
                ? <i className="material-icons hand" style={{}}
                  onClick={() => deleteComment(record._id)}
                >delete</i>

                : <></>
              } 
                      </span> {record.text}
                    


                      </h6>
                    )
                  })
                }
                <form onSubmit={(e) => {
                  e.preventDefault()
                  makeComment(e.target[0].value, item._id)
                }}>
                  <div className="card-action">
                    <input type="text" placeholder="add a comment" />
                  </div>

                </form>

              </div>
            </div>
          )
        })
      }


    </div>
  )
}
export default Home