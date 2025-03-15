import React, { useState } from 'react';

const Feedback = () => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real application, you would send this data to the server
    console.log('Feedback submitted:', { rating, comment });
    
    // Reset form and show thank you message
    setSubmitted(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setShowFeedback(false);
      setSubmitted(false);
      setRating(0);
      setComment('');
    }, 3000);
  };
  
  if (submitted) {
    return (
      <div className="feedback-section mt-4">
        <div className="alert alert-success">
          Thank you for your feedback!
        </div>
      </div>
    );
  }
  
  return (
    <div className="feedback-section mt-4">
      {showFeedback ? (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Rate Your Experience</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <div className="rating-buttons">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`btn btn-outline-warning me-1 ${
                        rating >= value ? 'active' : ''
                      }`}
                      onClick={() => setRating(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="comment" className="form-label">
                  Comments (Optional)
                </label>
                <textarea
                  id="comment"
                  className="form-control"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowFeedback(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={rating === 0}
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setShowFeedback(true)}
        >
          Leave Feedback
        </button>
      )}
    </div>
  );
};

export default Feedback;
