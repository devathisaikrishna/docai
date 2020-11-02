import React from "react";

import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useExpanded } from "react-table";
import Pagination from './Pagination'


// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
const Table = React.forwardRef(({
    columns,
    data,
    fetchData,
    loading,
    pageCount: controlledPageCount,
    globalFilter,
    refreashTable: refreshData,
    renderRowSubComponent
}, ref) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        visibleColumns,
        // Get the state from the instance
        state: { pageIndex, pageSize, sortBy, filterBy }
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 }, // Pass our hoisted table state
            manualPagination: true,
            autoResetPage: false,
            manualSortBy: true,
            autoResetSortBy: false,
            pageCount: controlledPageCount
        },
        useFilters,
        useGlobalFilter, // useGlobalFilter!
        useSortBy,
        useExpanded,
        usePagination,
    );

    // Listen for changes in pagination and use the state to fetch our new data
    React.useEffect(() => {
        fetchData({ pageIndex, pageSize, sortBy, filterBy, globalFilter });
    }, [globalFilter, sortBy, fetchData, pageIndex, pageSize]);

    React.useImperativeHandle(ref, () => ({
        refreashTable() {
            fetchData({ pageIndex, pageSize, sortBy, filterBy, globalFilter });
        }
    }));
    // refreshData(refreashTable);

    // Render the UI for your table
    return (
        <>
            {/* <pre>
                <code>
                    {JSON.stringify(
                        {
                            pageIndex,
                            pageSize,
                            pageCount,
                            canNextPage,
                            canPreviousPage
                        },
                        null,
                        2
                    )}
                </code>
            </pre> */}
            <table className="table table-hover " {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Header")}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? <i className='icon ocr-down-thin'></i>
                                                : <i className='icon ocr-up-thin'></i>
                                            : ""}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                {loading && (
                    // Use our custom loading state to show a loading indicator
                    <tbody>
                        <tr >
                            <td colSpan={columns.length} align="center">Loading...</td>
                        </tr>
                    </tbody>
                )}

                {page.length === 0 && !loading && (<tbody>
                    <tr >
                        <td colSpan={columns.length} align="center">No record found</td>
                    </tr>
                </tbody>)
                }

                {/* <React.Fragment {...getTableBodyProps()}> */}
                <React.Fragment >

                    {!loading && page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tbody key={i + 1} >
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                        );
                                    })}
                                </tr>

                                {/*
                                If the row is in an expanded state, render a row with a
                                column that fills the entire length of the table.
                            */}
                                {row.isExpanded ? (
                                    <tr>
                                        <td className="expanded_box" colSpan={visibleColumns.length}>
                                            {/*
                                    Inside it, call our renderRowSubComponent function. In reality,
                                    you could pass whatever you want as props to
                                    a component like this, including the entire
                                    table instance. But for this example, we'll just
                                    pass the row
                                    */}
                                            {renderRowSubComponent({ row })}
                                        </td>
                                    </tr>

                                ) : null}
                            </tbody>
                        );
                    })}


                </React.Fragment>
            </table>
            {/* 
                Pagination can be built however you'd like. 
                This is just a very basic UI implementation:
            */}
            <div className="pagination d-flex justify-content-between">
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                    className={"Select_box_table mt-2"}
                >
                    {[5, 10, 20, 30, 40].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>

                <Pagination
                    pageIndex={pageIndex}
                    pageCount={pageCount}
                    gotoPage={gotoPage}
                    previousPage={previousPage}
                    nextPage={nextPage}
                    canPreviousPage={canPreviousPage}
                    canNextPage={canNextPage}
                />
            </div>
        </>
    );
})


export default Table;
