
import React from 'react'

function Pagination({ pageIndex, pageCount, gotoPage, previousPage, nextPage, canPreviousPage, canNextPage }) {

    var visiblePages = getVisiblePages(pageIndex, pageCount);

    return (

        <nav aria-label="..." className="mt-2">
            <ul className="pagination rounded-flat pagination-success">
                <li className="page-item " onClick={() => previousPage()}>
                    <button className="page-link" disabled={!canPreviousPage} ><i className="icon-arrow-left"></i></button>
                </li>
                {visiblePages.map((page, index, array) => {
                    if (array[index - 1] + 2 < page) {
                        return (
                            <>
                                <li
                                    key={index}
                                    className={"page-item " + (pageIndex === index ? "active" : "")} key={index + 1}
                                    onClick={() => gotoPage(page - 1)}
                                >
                                    <button className={"page-link "} >...</button>
                                </li>
                                <li
                                    key={index}
                                    className={"page-item " + (pageIndex === index ? "active" : "")} key={index + 1}
                                    onClick={() => gotoPage(page - 1)}
                                >
                                    <button className={"page-link "} >{page}</button>
                                </li>
                            </>);
                    } else {
                        return (
                            <li
                                key={index}
                                className={"page-item " + (pageIndex === index ? "active" : "")} key={index + 1}
                                onClick={() => gotoPage(page - 1)}
                            >
                                <button className={"page-link "} >{page}</button>
                            </li>);
                    }

                })}
                <li className="page-item" onClick={() => nextPage()}>
                    <button className="page-link" disabled={!canNextPage} ><i className="icon-arrow-right"></i></button>
                </li>
            </ul>
        </nav>

    )
}

export default Pagination;

const getVisiblePages = (page, total) => {
    if (total < 7) {
        return filterPages([1, 2, 3, 4, 5, 6], total);
    } else {
        if (page % 5 >= 0 && page > 4 && page + 2 < total) {
            return [1, page - 1, page, page + 1, total];
        } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
            return [1, total - 3, total - 2, total - 1, total];
        } else {
            return [1, 2, 3, 4, 5, total];
        }
    }
};

const filterPages = (visiblePages, totalPages) => {
    return visiblePages.filter(page => page <= totalPages);
};