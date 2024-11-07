import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Terms = () => {
  return (
    <Container maxWidth="lg" sx={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Lumina Archives Code of Conduct
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        General Expectations
      </Typography>
      <Box sx={{ marginBottom: '16px' }}>
        <Typography paragraph>
          - <strong>Safe and Welcoming Spaces:</strong> All users should feel safe, clean, and welcome.
        </Typography>
        <Typography paragraph>
          - <strong>Access to Resources:</strong> Users should have access to collections, equipment, and services for academic purposes (research and coursework).
        </Typography>
        <Typography paragraph>
          - <strong>Privacy and Confidentiality:</strong> Users are entitled to privacy and confidentiality in their use of library collections and services.
        </Typography>
      </Box>

      <Typography variant="h6" gutterBottom>
        Behavior
      </Typography>
      <Box sx={{ marginBottom: '16px' }}>
        <Typography paragraph>
          - <strong>Compliance with Staff Requests:</strong> Users are expected to comply with requests from library staff and security personnel. Identification may be requested.
        </Typography>
        <Typography paragraph>
          - <strong>Courteous Conduct:</strong> Respectful behavior is mandatory. Inappropriate behaviors include excessive noise, rowdiness, abusive language, and offensive sexual behavior.
        </Typography>
        <Typography paragraph>
          - <strong>Posting Announcements:</strong> Flyers may only be posted on designated bulletin boards.
        </Typography>
        <Typography paragraph>
          - <strong>Dress Code:</strong> Users should dress appropriately (shirts and shoes required).
        </Typography>
        <Typography paragraph>
          - <strong>Cleanliness:</strong> Maintain a clean environment by disposing of trash properly.
        </Typography>
        <Typography paragraph>
          - <strong>Personal Property Safety:</strong> Keep personal belongings with you; Lumina Archives is not responsible for unattended items.
        </Typography>
        <Typography paragraph>
          - <strong>Sleeping in the Library:</strong> For personal safety, sleeping in the library is not recommended.
        </Typography>
      </Box>

      <Typography variant="h6" gutterBottom>
        Food and Drink
      </Typography>
      <Typography paragraph>
        - Food and drink are allowed on all floors except near computers.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Abuse of Library Resources
      </Typography>
      <Typography paragraph>
        - Users must respect library collections and facilities. Intentional damage may result in penalties.
      </Typography>
      <Typography paragraph>
        - <strong>Prohibited behaviors include:</strong>
        <ul>
          <li>Writing in or damaging library materials</li>
          <li>Careless actions leading to damage</li>
          <li>Leaving items unattended</li>
          <li>Removing materials without proper checkout</li>
          <li>Misplacing materials to hinder access for others</li>
        </ul>
      </Typography>

      <Typography variant="h6" gutterBottom>
        Use of Electronic/Digital Resources
      </Typography>
      <Typography paragraph>
        - Users must adhere to Lumina Archives Terms of Use for electronic resources.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Scanning, Copying, and Copyright
      </Typography>
      <Typography paragraph>
        - Use of library equipment must comply with U.S. copyright laws and library policies.
      </Typography>

      <Typography variant="h6" gutterBottom>
        General Guidelines
      </Typography>
      <Typography paragraph>
        - Observe all federal and state laws, local ordinances, and university policies.
      </Typography>
      <Typography paragraph>
        - <strong>Tobacco-Free Campus:</strong> Smoking and electronic cigarettes are prohibited.
      </Typography>
      <Typography paragraph>
        - <strong>Filming and Photography:</strong> Require prior approval for filming and photography in Lumina Archives.
      </Typography>
      <Typography paragraph>
        - <strong>Service Animals Only:</strong> Only service animals are allowed in Lumina Archives.
      </Typography>

    </Container>
  );
};

export default Terms;
