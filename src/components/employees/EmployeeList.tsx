import React, { useState } from 'react';
import { Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { selectProfile } from '../../store/employees/employeeProfilesSlice';
import { EmployeeProfile, EmploymentStatus } from '../../services/employeeProfileService';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';
import Pagination from '../common/Pagination';

export const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profiles, currentPage, totalPages, isLoading } = useSelector(
    (state: RootState) => state.employeeProfiles
  );

  const [searchTerm, setSearchTerm] = useState('');

  const handleViewEmployee = (employee: EmployeeProfile) => {
    dispatch(selectProfile(employee));
    navigate(`/employees/${employee.id}`);
  };

  const filteredProfiles = profiles.filter(profile =>
    `${profile.user?.firstName} ${profile.user?.lastName} ${profile.employeeCode}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="text-center p-3">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>
            <i className="fas fa-search"></i>
          </InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {filteredProfiles.length === 0 ? (
        <div className="text-center text-muted p-5">
          <i className="fas fa-users-slash fa-3x mb-3"></i>
          <p>No employees found</p>
        </div>
      ) : (
        <>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Employee Code</th>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Status</th>
                <th>Hire Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.map((profile) => (
                <tr key={profile.id}>
                  <td>
                    <strong>{profile.employeeCode}</strong>
                  </td>
                  <td>
                    {profile.user?.firstName} {profile.user?.lastName}
                  </td>
                  <td>{profile.jobTitle || '-'}</td>
                  <td>{profile.department || '-'}</td>
                  <td>
                    <EmployeeStatusBadge status={profile.status} />
                  </td>
                  <td>{new Date(profile.hireDate).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => handleViewEmployee(profile)}
                    >
                      <i className="fas fa-eye"></i> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                // Handle page change
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
