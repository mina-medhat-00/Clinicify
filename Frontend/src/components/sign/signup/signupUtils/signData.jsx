import { Select } from "antd";
const { Option } = Select;
const DoctorOptions = (
  <>
    <Option value="Internal medicine">Internal medicine</Option>
    <Option value="Pediatrics">Pediatrics</Option>
    <Option value="Surgery">Surgery</Option>
    <Option value="Family medicine">Family medicine</Option>
    <Option value="Anesthesiology">Anesthesiology</Option>
    <Option value="Neurology">Neurology</Option>
    <Option value="Emergency medicine">Emergency medicine</Option>
    <Option value="Dermatology">Dermatology</Option>
    <Option value="Ophthalmology">Ophthalmology</Option>
    <Option value="Oncology">Oncology</Option>
    <Option value="Obstetrics and gynaecology">
      Obstetrics and gynaecology
    </Option>
    <Option value="Psychiatry">Psychiatry</Option>
    <Option value="General surgery">General surgery</Option>
    <Option value="Urology">Urology</Option>
    <Option value="Nuclear medicine">Nuclear medicine</Option>
    <Option value="Diagnostic Radiology">Diagnostic Radiology</Option>
    <Option value="Immunology">Immunology</Option>
    <Option value="Physical">Physical therapy</Option>
    <Option value="Preventive">Preventive healthcare</Option>
    <Option value="Medical genetics">Medical genetics</Option>
    <Option value="Orthopedics">Orthopedics</Option>
    <Option value="Cardiology">Cardiology</Option>
    <Option value="Otorhinolaryngology">Otorhinolaryngology</Option>
    <Option value="Gastroenterology">Gastroenterology</Option>
    <Option value="Plastic surgery">Plastic surgery</Option>
    <Option value="Neurosurgery">Neurosurgery</Option>
    <Option value="Cardiothoracic surgery">Cardiothoracic surgery</Option>
    <Option value="Pulmonology">Pulmonology</Option>
    <Option value="Rheumatology">Rheumatology</Option>
    <Option value="Intensive care medicine">Intensive care medicine</Option>
    <Option value="Geriatrics">Geriatrics</Option>
    <Option value="Endocrinology">Endocrinology</Option>
    <Option value="Nephrology">Nephrology</Option>
    <Option value="Hematology">Hematology</Option>
    <Option value="Pathology">Pathology</Option>
    <Option value="Occupational medicine">Occupational medicine</Option>
    <Option value="Clinical chemistry">Clinical chemistry</Option>
    <Option value="Public health">Public health</Option>
    <Option value="Clinical pathology">Clinical pathology</Option>
    <Option value="Medical microbiology">Medical microbiology</Option>
    <Option value="Pain management">Pain management</Option>
    <Option value="Anatomical pathology">Anatomical pathology</Option>
    <Option value="Primary care">Primary care</Option>
    <Option value="Radiology">Radiology</Option>
    <Option value="Vascular surgery">Vascular surgery</Option>
    <Option value="Pediatric Hematology Oncology">
      Pediatric Hematology Oncology
    </Option>
    <Option value="Spinal Cord Injury Medicine">
      Spinal Cord Injury Medicine
    </Option>
    <Option value="Pediatric surgery">Pediatric surgery</Option>
    <Option value="Oral and maxillofacial surgery">
      Oral and maxillofacial surgery
    </Option>
    <Option value="Colorectal surgery">Colorectal surgery</Option>
    <Option value="Developmental-Behavioral Pedia">
      Developmental-Behavioral Pedia
    </Option>
  </>
);
const NurseOptions = (
  <>
    <Option value="Nurse Educator">Nurse Educator</Option>
    <Option value="School Nurse">School Nurse</Option>
    <Option value="Nurse Administrator">Nurse Administrator</Option>
    <Option value="Public Health Nurse">Public Health Nurse</Option>
    <Option value="Nurse Researcher">Nurse Researcher</Option>
    <Option value="Nurse Informaticist">Nurse Informaticist</Option>
    <Option value="Case Management Nurse">Case Management Nurse</Option>
    <Option value="Home Health Nurse">Home Health Nurse</Option>
    <Option value="Clinic Nurse">Clinic Nurse</Option>
    <Option value="Other">Other</Option>
  </>
);
const cityOption = (
  <>
    <Option value="Cairo"> Cairo</Option>
    <Option value="Giza">Giza</Option>
    <Option value="Alexandria">Alexandria</Option>
    <Option value="Madīnat as Sādis min Uktūbar">
      Madīnat as Sādis min Uktūbar
    </Option>
    <Option value="Shubrā al Khaymah">Shubrā al Khaymah</Option>
    <Option value="Al Manşūrah">Al Manşūrah</Option>
    <Option value="Ḩalwān">Ḩalwān</Option>
    <Option value="Al Maḩallah al Kubrá">Al Maḩallah al Kubrá</Option>
    <Option value="Port Said">Port Said</Option>
    <Option value="Suez">Suez</Option>
    <Option value="Ţanţā">Ţanţā</Option>
    <Option value="Asyūţ">Asyūţ</Option>
    <Option value="Al Fayyūm">Al Fayyūm</Option>
    <Option value="Az Zaqāzīq">Az Zaqāzīq</Option>
    <Option value="Ismailia">Ismailia</Option>
    <Option value="Aswān">Aswān</Option>
    <Option value="Kafr ad Dawwār">Kafr ad Dawwār</Option>
    <Option value="Damanhūr">Damanhūr</Option>
    <Option value="Al Minyā">Al Minyā</Option>
    <Option value="Damietta">Damietta</Option>
    <Option value="Luxor">Luxor</Option>
    <Option value="Qinā">Qinā</Option>
    <Option value="Sūhāj">Sūhāj</Option>
    <Option value="Banī Suwayf">Banī Suwayf</Option>
    <Option value="Shibīn al Kawm">Shibīn al Kawm</Option>
    <Option value="Al ‘Arīsh">Al ‘Arīsh</Option>
    <Option value="Al Ghardaqah">Al Ghardaqah</Option>
    <Option value="Banhā">Banhā</Option>
    <Option value="Kafr ash Shaykh">Kafr ash Shaykh</Option>
    <Option value="Disūq">Disūq</Option>
    <Option value="Bilbays">Bilbays</Option>
    <Option value="Mallawī">Mallawī</Option>
    <Option value="Idfū">Idfū</Option>
    <Option value="Mīt Ghamr">Mīt Ghamr</Option>
    <Option value="Munūf">Munūf</Option>
    <Option value="Jirjā">Jirjā</Option>
    <Option value="Akhmīm">Akhmīm</Option>
    <Option value="Ziftá">Ziftá</Option>
    <Option value="Samālūţ">Samālūţ</Option>
    <Option value="Manfalūţ">Manfalūţ</Option>
    <Option value="Banī Mazār">Banī Mazār</Option>
    <Option value="Armant">Armant</Option>
    <Option value="Maghāghah">Maghāghah</Option>
    <Option value="Kawm Umbū">Kawm Umbū</Option>
    <Option value="Būr Fu’ād">Būr Fu’ād</Option>
    <Option value="Al Qūşīyah">Al Qūşīyah</Option>
    <Option value="Rosetta">Rosetta</Option>
    <Option value="Isnā">Isnā</Option>
    <Option value="Maţrūḩ">Maţrūḩ</Option>
    <Option value="Abnūb">Abnūb</Option>
    <Option value="Hihyā">Hihyā</Option>
    <Option value="Samannūd">Samannūd</Option>
    <Option value="Dandarah">Dandarah</Option>
    <Option value="Al Khārjah">Al Khārjah</Option>
    <Option value="Al Balyanā">Al Balyanā</Option>
    <Option value="Maţāy">Maţāy</Option>
    <Option value="Naj‘ Ḩammādī">Naj‘ Ḩammādī</Option>
    <Option value="Şān al Ḩajar al Qiblīyah">Şān al Ḩajar al Qiblīyah</Option>
    <Option value="Dayr Mawās">Dayr Mawās</Option>
    <Option value="Ihnāsyā al Madīnah">Ihnāsyā al Madīnah</Option>
    <Option value="Darāw">Darāw</Option>
    <Option value="Abū Qīr">Abū Qīr</Option>
    <Option value="Fāraskūr">Fāraskūr</Option>
    <Option value="Ra’s Ghārib">Ra’s Ghārib</Option>
    <Option value="Al Ḩusaynīyah">Al Ḩusaynīyah</Option>
    <Option value="Safājā">Safājā</Option>
    <Option value="Qiman al ‘Arūs">Qiman al ‘Arūs</Option>
    <Option value="Qahā">Qahā</Option>
    <Option value="Al Karnak">Al Karnak</Option>
    <Option value="Hirrīyat Raznah">Hirrīyat Raznah</Option>
    <Option value="Al Quşayr">Al Quşayr</Option>
    <Option value="Kafr Shukr">Kafr Shukr</Option>
    <Option value="Sīwah">Sīwah</Option>
    <Option value="Kafr Sa‘d">Kafr Sa‘d</Option>
    <Option value="Shārūnah">Shārūnah</Option>
    <Option value="Aţ Ţūr">Aţ Ţūr</Option>
    <Option value="Rafaḩ">Rafaḩ</Option>
    <Option value="Ash Shaykh Zuwayd">Ash Shaykh Zuwayd</Option>
    <Option value="Bi’r al ‘Abd">Bi’r al ‘Abd</Option>
  </>
);
export { NurseOptions, DoctorOptions, cityOption };
