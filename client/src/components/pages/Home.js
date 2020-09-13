import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'

const Home = () => {
  const [data, setData] = useState([])
  const [comments, setComments] = useState([])
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    fetch('/allmessages', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("guestBook-jwt")
      }
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        setData(result.messages)
      })
  }, [])

  const deleteMessage = (messageid) => {
    fetch(`/deletemessage/${messageid}`, {
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

  const makeComment = (text, messageId) => {
    fetch('/comment', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("guestBook-jwt")
      },
      body: JSON.stringify({
        messageId,
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
        fetch('/allmessages', {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("guestBook-jwt")
          }
        }).then(res => res.json())
          .then(result => {
            console.log(result)
            setData(result.messages)
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
                ? <>
                <i className="material-icons hand" style={{
                  float: "right"
                }}
                  onClick={() => deleteMessage(item._id)}
                >delete</i>
               <Link to={"/updatemessage/"+item._id}> 
                <i className="material-icons hand" style={{
                  float: "right"
                }}
                >edit</i></Link>
                </>
                : <></>
              }

              <h5 style={{ padding: "5px" }}>
                  {item.postedBy.name}
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
                  e.target[0].value=""
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