import React, { useState, useEffect, useCallback } from 'react';
import {
    SearchCard, Popupcard, SimpleCard, PopupSimpleCard, CreateForm, Table, alertActions, modalActions, useSelector, useDispatch, api, downloadLink, useFetch, Provider, classes, Row, Button, NavCreateForm
} from '../../../Components/CommonImports/CommonImports'
import DocumentAccessHistoryTable from '../Table/DocumentAccessHistoryTable';

function DocumentAccessHistory(props) {


    const { get, post, cache, response, loading, error } = useFetch({ data: [] });
    const [data, setData] = useState([])

    const loadInitialLists = useCallback(async () => {
        const loadedLists = await post(api + `/documentAccess/getAllDocumentAccess/${props?.selectedItem?.reportDocId}`, {rand: Math.random()});
        if (loadedLists.length > 0) {
            setData([...loadedLists]);
        } else {
            setData([])
        }
    }, []);

    useEffect(() => {
        loadInitialLists();
    }, []);

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;
    }

    return (
        <div className={classes.container}>
            <Popupcard
                title="Access Time"

            >

                <PopupSimpleCard>

                    <Table cols={DocumentAccessHistoryTable()}
                        data={data} striped
                        rows={10} /> </PopupSimpleCard>
            </Popupcard>

        </div>
    );
}

export default DocumentAccessHistory;


