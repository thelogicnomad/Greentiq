export interface CompanyMultiSelectProps {
  availableCompanies: string[];
  selectedCompanies: string[];
  onCompanyToggle: (company: string) => void;
  onCompanyRemove: (company: string) => void;
}
