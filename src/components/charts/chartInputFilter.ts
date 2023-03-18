
export type ChartInputFilter = {
    filter: Filter
}

export type SummaryInputParams = {
  filter: Filter,
  axisX: string,
  axisY: string,
  setFilter: React.Dispatch<React.SetStateAction<{}>>
} 

export type ChartInputParams = {
  axisX: string;
  axisY: string;
  filter: Filter,
  timeInterval?: number,
  type?: 'bar' | 'doughnat' | 'line'
}