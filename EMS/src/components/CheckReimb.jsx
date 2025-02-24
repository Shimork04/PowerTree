import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/CheckRL.css';  // Import the CSS file

const CheckReimb = () => {
  const { id } = useParams();
  const [reimbursement, setReimbursement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState("");
  const navigate = useNavigate();

  const adminId = window.localStorage.getItem("uid");

  useEffect(() => {
    const fetchReimbursement = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/reimbursements/${id}`);
        setReimbursement(response.data);
      } catch (error) {
        setError("Error fetching reimbursement application");
        console.error("Error fetching reimbursement application:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReimbursement();
  }, [id]);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`http://localhost:8001/reimbursements/${id}/status`, { status, review });
      setReimbursement((prevReimbursement) => ({
        ...prevReimbursement,
        status,
      }));
      navigate("/homea/reimba");
    } catch (error) {
      console.error("Error updating reimbursement status:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this reimbursement application?");
    if (confirmDelete) {
      try {
        const res = await axios.delete(`http://localhost:8001/reimbursements/${id}`);
        console.log('Delete response:', res.data);
        navigate("/homea/reimba");
      } catch (error) {
        console.error("Error deleting reimbursement:", error.response || error);
        alert("Failed to delete reimbursement.");
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!reimbursement) {
    return <div className="not-found">Reimbursement application not found</div>;
  }

  return (
    <div className="containercrl mt-5">
      <div className="cardcrl">
        <div className="cardcrl-header">
          <h2>APPLICATION DETAILS</h2>
        </div>
        <div className="cardcrl-body">
          <p><strong>Employee UID:</strong> {reimbursement.uid}</p>
          <p><strong>Expense Type:</strong> {reimbursement.expenseType}</p>
          <p><strong>Vehicle Type:</strong> {reimbursement.vehicleType || '-'}</p>
          <p><strong>Total Kms:</strong> {reimbursement.totalKms || '-'}</p>
          <p><strong>Description:</strong> {reimbursement.description}</p>
          <p><strong>Start Date:</strong> {new Date(reimbursement.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(reimbursement.endDate).toLocaleDateString()}</p>
          <p><strong>GST Type:</strong> {reimbursement.gstType}</p>
          <p><strong>Status:</strong> {reimbursement.status}</p>
          <p><strong>Total Expense:</strong> {reimbursement.totalExpense}</p>
          <div>
            <strong>Proofs:</strong>
            <ul>
              {reimbursement.proofs && reimbursement.proofs.length > 0 ? (
                reimbursement.proofs.map((proof, index) => (
                  <div key={index}>
                    <a href={proof} target="_blank" rel="noopener noreferrer">
                      View Proof {index + 1}
                    </a>
                  </div>
                ))
              ) : (
                "No Proof Uploaded"
              )}
            </ul>
          </div>
          <p><strong>Review:</strong> {reimbursement.review}</p>
          <div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Add your review here"
              rows="4"
              cols="50"
              className="form-controlcrl"
            />
          </div>
        </div>
        <div className="cardcrl-footer">
          <div className="button-groupcrl">
            {(reimbursement.status === "Pending by Accountant" || reimbursement.status === "On Hold by Accountant") && adminId === "A005"  && (
              <>
                <button className="btn btn-warningcrl" onClick={() => handleStatusChange(reimbursement._id, "Pending by CMO")}>
                  Send for Approval
                </button>
                <button className="btn btn-dangercrl" onClick={() => handleStatusChange(reimbursement._id, "Rejected")}>
                  Reject
                </button>
                <button className="btn btn-secondarycrl" onClick={() => handleStatusChange(reimbursement._id, "On Hold by Accountant")}>
                  On Hold
                </button>
              </>
            )}
            {(reimbursement.status === "Pending by CMO" || reimbursement.status === "On Hold by CMO") && adminId === "A003"  && (
              <>
                <button className="btn btn-warningcrl" onClick={() => handleStatusChange(reimbursement._id, "Pending by CEO")}>
                  Send for Approval
                </button>
                <button className="btn btn-dangercrl" onClick={() => handleStatusChange(reimbursement._id, "Rejected")}>
                  Reject
                </button>
                <button className="btn btn-secondarycrl" onClick={() => handleStatusChange(reimbursement._id, "On Hold by CMO")}>
                  On Hold
                </button>
              </>
            )}
            {(reimbursement.status === "Pending by CEO" || reimbursement.status === "On Hold by CEO") && adminId === "A001"  && (
              <>
                <button className="btn btn-successcr" onClick={() => handleStatusChange(reimbursement._id, "Approved")}>
                  Approve
                </button>
                <button className="btn btn-dangercrl" onClick={() => handleStatusChange(reimbursement._id, "Rejected")}>
                  Reject
                </button>
                <button className="btn btn-secondarycrl" onClick={() => handleStatusChange(reimbursement._id, "On Hold by CEO")}>
                  On Hold
                </button>
              </>
            )}
            <button className="btn btn-successcrl" onClick={() => handleDelete(reimbursement._id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckReimb;
