"use client"

import * as React from "react";

import {
  Grid,
  GridColumn,
  GridToolbar,
  type GridDetailRowProps,
  type GridDetailExpandChangeEvent,
  type GridGroupExpandChangeEvent,
} from "@progress/kendo-react-grid";
import { type DetailExpandDescriptor, type GroupExpandDescriptor } from "@progress/kendo-react-data-tools";

import { GridPDFExport } from "@progress/kendo-react-pdf";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import data from "./data.json";
import { Button } from "@progress/kendo-react-buttons";
import { AppBar, AppBarSection } from "@progress/kendo-react-layout";

const DetailComponent = (props: GridDetailRowProps) => {
  const dataItem = props.dataItem;

    return (
      <div>
        <section style={{ width: "200px", float: "left" }}>
          <p>
            <strong>Street:</strong> {dataItem.shipAddress.street}
          </p>
          <p>
            <strong>City:</strong> {dataItem.shipAddress.city}
          </p>
          <p>
            <strong>Country:</strong> {dataItem.shipAddress.country}
          </p>
          <p>
            <strong>Postal Code:</strong> {dataItem.shipAddress.postalCode}
          </p>
        </section>
        <Grid style={{ width: "500px" }} data={dataItem.details} />
      </div>
    );
};

export default function GridVite() {
  const [groupExpand, setGroupExpand] = React.useState<GroupExpandDescriptor[]>([]);
  const [detailExpand, setDetailExpand] = React.useState<DetailExpandDescriptor>({});

  const handleGroupExpand = (event: GridGroupExpandChangeEvent) => {
    setGroupExpand(event.groupExpand);
  };

  const handleDetailExpandChange = (event: GridDetailExpandChangeEvent) => {
    setDetailExpand(event.detailExpand);
  };

  let _pdfExport: GridPDFExport | null;
  const exportExcel = () => {
      if (_export) {
          _export.save();
      }
  };

  let _export: ExcelExport | null;
  const exportPDF = () => {
      if (_pdfExport) {
          _pdfExport.save();
      }
  };

  return (
    <>
      <AppBar position="top">
        <AppBarSection>
            <Button themeColor="primary" fillMode="flat" className="k-mr-1">
              <a href="/">Home</a>
            </Button>
        </AppBarSection>
      </AppBar>
      <div className="k-mt-4">
        <ExcelExport
          data={data}
          ref={(exporter) => {
            _export = exporter;
          }}
        >
          <Grid
            id="test"
            style={{ height: "700px" }}
            sortable={true}
            defaultSort={[{ field: "orderDate", dir: "desc" }]}
            filterable={true}
            groupable={true}
            defaultGroup={[{ field: "customerID" }]}
            reorderable={true}
            pageable={{ buttonCount: 4, pageSizes: true }}
            defaultTake={20}
            defaultSkip={0}
            data={data}
            autoProcessData={true}
            dataItemKey="orderID"
            detail={DetailComponent}
            detailExpand={detailExpand}
            onDetailExpandChange={handleDetailExpandChange}
            groupExpand={groupExpand}
            onGroupExpandChange={handleGroupExpand}
          >
            <GridToolbar>
              <Button
                title="Export to Excel"
                onClick={exportExcel}
              >
                Export to Excel
              </Button>
              &nbsp;
              <Button
                onClick={exportPDF}
              >
                Export to PDF
              </Button>
            </GridToolbar>
            <GridColumn field="customerID" width="200px" />
            <GridColumn
              field="orderDate"
              filter="date"
              format="{0:D}"
              width="300px"
            />
            <GridColumn field="shipName" width="280px" />
            <GridColumn field="freight" filter="numeric" width="200px" />
            <GridColumn
              field="shippedDate"
              filter="date"
              format="{0:D}"
              width="300px"
            />
            <GridColumn field="employeeID" filter="numeric" width="200px" />
            <GridColumn
              locked={true}
              field="orderID"
              filterable={false}
              title="ID"
              width="90px"
            />
          </Grid>
        </ExcelExport>
        <GridPDFExport
          ref={(element: any) => {
            _pdfExport = element;
          }}
          margin="1cm"
        >
          {
            <Grid
              data={data}
              autoProcessData={true}
              defaultSkip={0}
              defaultTake={20}
            >
              <GridColumn field="customerID" width="200px" />
              <GridColumn
                field="orderDate"
                filter="date"
                format="{0:D}"
                width="300px"
              />
              <GridColumn field="shipName" width="280px" />
              <GridColumn field="freight" filter="numeric" width="200px" />
              <GridColumn
                field="shippedDate"
                filter="date"
                format="{0:D}"
                width="300px"
              />
              <GridColumn field="employeeID" filter="numeric" width="200px" />
              <GridColumn
                locked={true}
                field="orderID"
                filterable={false}
                title="ID"
                width="90px"
              />
            </Grid>
          }
        </GridPDFExport>
      </div>
    </>
  );
}