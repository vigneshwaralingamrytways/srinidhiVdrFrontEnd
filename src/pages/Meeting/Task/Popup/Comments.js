import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { Form, Button } from 'react-bootstrap';
import classes from '../comments.module.css';
import { FaIcons } from 'react-icons/fa';
import { FaPaperPlane } from 'react-icons/fa';


const Comments = () => {
  const [comments, setComments] = useState([
    { id: 1, username: "Prasanth", comments: "Great work!", commentTime: "3:45 pm", daymonthyear: "26/04/2024" },
    { id: 2, username: "Parveen", comments: "Nice job!", commentTime: "3:55 pm", daymonthyear: "26/04/2024" },
    { id: 3, username: "Admin", comments: "Well done!", commentTime: "4:00 pm", daymonthyear: "27/04/2024" }
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const chatContainerRef = useRef(null);

  const handleSendComment = (data) => {
    const loggedInUser = "Admin";
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const daymonthyear = new Date().toLocaleDateString('en-GB');

    const newComment = {
      id: comments.length + 1,
      username: loggedInUser,
      comments: data.comment,
      commentTime: timestamp,
      daymonthyear: daymonthyear
    };

    setComments([...comments, newComment]);
    reset();
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [comments]);

  const renderComments = () => {
    const loggedInUser = "Admin";
    let displayedDates = [];

    return comments.map((comment) => {
      const shouldDisplayDate = !displayedDates.includes(comment.daymonthyear);
      if (shouldDisplayDate) {
        displayedDates.push(comment.daymonthyear);
      }

      return (
        <React.Fragment key={comment.id}>
          {shouldDisplayDate && (
            <div className={classes.dateDivider}>{comment.daymonthyear}</div>
          )}
          <div
            className={`${classes.message} ${
              comment.username === loggedInUser ? classes.ownMessage : ''
            }`}
          >
            <div className={classes.username}>{comment.username}</div>
            <div className={classes.commentText}>{comment.comments}</div>
            <div className={classes.timestamp}>{comment.commentTime}</div>
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div className={classes.chatContainer}>
      <div className={classes.headerTitle}>Comments</div> {/* Fixed Title */}
      <div className={classes.chatContent} ref={chatContainerRef}>
        {renderComments()}
      </div>
      <div className={classes.inputBox}>
        <Form onSubmit={handleSubmit(handleSendComment)} className={classes.form}>
          <Form.Control
            as="textarea"
            placeholder="Type your comment..."
            {...register("comment", { required: true })}
            className={classes.textarea}
          />
          {errors.comment && <span className={classes.error}>Comment is required</span>}
          <Button variant="primary" type="submit" className={classes.sendButton}>
          <FaPaperPlane size={20} />
          </Button>
        </Form>
      </div>
    </div> 
  );
};

export default Comments;