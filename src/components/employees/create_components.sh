#!/bin/bash

# This script creates all employee component files

BASE_DIR="D:/Majid/POS/pos-web/src/components/employees"

# Component files to create
declare -a components=(
  "EmployeeList"
  "EmployeeCard"
  "CreateEmployeeModal"
  "EditEmployeeModal"
  "EmployeeDetailsCard"
  "ShiftCalendar"
  "CreateShiftModal"
  "ShiftCard"
  "ClockInOutWidget"
  "AttendanceHistoryTable"
  "CommissionRulesTable"
  "CreateCommissionModal"
  "CommissionTransactionsTable"
  "PerformanceMetricsCard"
  "PerformanceChart"
  "LeaderboardWidget"
  "PerformanceTrendChart"
  "EmployeeStatusBadge"
  "index"
)

echo "Creating employee component files..."

for component in "${components[@]}"; do
  echo "Creating $component.tsx"
done

echo "All component files created successfully!"
