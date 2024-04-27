import React from 'react'
import ReactPaginate from 'react-paginate';
import './Pagination.css'

const Pagination = ({pageCount, handlePageClick, currentPage}) => {
  return (
    <>
        <ReactPaginate
                        breakLabel="..."
                        nextLabel="next >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel="< previous"
                        marginPagesDisplayed={2}
                        containerClassName="pagination justify-content-center"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        activeClassName="active"
                        activeLinkClassName="active"
                        forcePage={currentPage - 1}
                    />
    </>
  )
}

export default Pagination