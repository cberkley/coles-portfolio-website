export type Role = {
  title: string
  period: string
  location?: string
  bullets?: string[]
}

export type ExperienceEntry = {
  company: string
  totalDuration?: string
  roles: Role[]
}

export const experience: ExperienceEntry[] = [
  {
    company: 'Gale Force Software Corporation / DeviceIQ',
    roles: [
      {
        title: 'Senior Software Engineer',
        period: 'Dec 2020 – Apr 2026 · 5 yrs 5 mos',
        location: 'Indianapolis, Indiana · On-site',
        bullets: [
          'Maintained SmallPond and ShopFloorIQ using ASP.NET, SQL Server, jQuery, and Bootstrap.',
          'Migrated ShopFloorIQ from on-prem servers to Microsoft Azure.',
          'Rebuilt SmallPond using ASP.NET Core, Swagger, and Aurelia 2.',
          'Built a custom component library using Lit for use across the product stack.',
        ],
      },
    ],
  },
  {
    company: 'RenPSG',
    totalDuration: '3 yrs 6 mos',
    roles: [
      {
        title: 'Software Engineer Team Lead',
        period: 'Mar 2020 – Dec 2020 · 10 mos',
        location: 'Indianapolis, Indiana',
        bullets: [
          'Maintained legacy DonorFirstX using ASP.NET Framework, C#, PL/SQL, Bootstrap, and jQuery.',
          'Worked on the new DonorFirstX using microservices, ASP.NET Core, C#, SQL Server, PL/SQL, Aurelia, and Custom Elements.',
          'Represented the team at cross-team meetings, ran sprint ceremonies, and served as first point of contact for ticket escalations.',
        ],
      },
      {
        title: 'Senior Software Engineer',
        period: 'Jan 2019 – Mar 2020 · 1 yr 3 mos',
        location: 'Indianapolis, Indiana',
      },
      {
        title: 'Software Engineer',
        period: 'Jul 2017 – Jan 2019 · 1 yr 7 mos',
        location: 'Indianapolis, Indiana',
      },
    ],
  },
  {
    company: 'Gale Force Software Corporation / DeviceIQ',
    roles: [
      {
        title: 'Software Engineer',
        period: 'Mar 2013 – Jul 2017 · 4 yrs 5 mos',
        location: 'Greater Indianapolis',
        bullets: [
          'Maintained SmallPond DNA databasing application using ASP.NET C# MVC.',
          'Made web UI cross-browser compatible with HTML, CSS, and JavaScript.',
          'Used Ajax and SignalR to make content update dynamically in real time.',
          'Created feature-rich applications using Telerik Kendo UI.',
          'Implemented authorization controls to restrict users from viewing unauthorized content.',
        ],
      },
    ],
  },
  {
    company: 'Olivet Nazarene University',
    roles: [
      {
        title: 'Web Programmer',
        period: 'Nov 2012 – Mar 2013 · 5 mos',
        location: 'Bourbonnais, IL',
        bullets: [
          'Maintained large-scale Ektron CMS websites.',
          'Redesigned the athletics.olivet.edu scheduling system using Ektron smart forms to improve efficiency and reduce load times.',
          'Used XSL, C#, HTML, JavaScript, and CSS to manage front-end pages through Ektron.',
          'Utilized Doc-e-fil to digitize paper forms and build document routing workflows.',
        ],
      },
    ],
  },
  {
    company: 'Wolfram Research',
    roles: [
      {
        title: 'Senior Web Developer',
        period: 'Aug 2010 – Nov 2012 · 2 yrs 4 mos',
        location: 'Champaign, IL',
        bullets: [
          'Collaborated with Design, UX, and QA to build interactive experiences across Wolfram websites.',
          'Created WordPress themes and plugins, including blog.wolframalpha.com.',
          'Wrote a shell script to abstract rsync and keep EdgeCast\'s CDN in sync with Wolfram\'s servers.',
          'Maintained pages on a Unix system using Perl, PHP, HTML, JavaScript, and CSS.',
          'Used CVS for version control across development, test, and production environments.',
        ],
      },
    ],
  },
  {
    company: 'LinkPoint Media',
    roles: [
      {
        title: 'Web Developer',
        period: 'Jul 2010 – Jul 2012 · 2 yrs 1 mo',
        location: 'Bourbonnais, IL',
        bullets: [
          'Built a business directory application using PHP, MySQL, JavaScript, HTML, and CSS.',
          'Created websites for small businesses using Joomla.',
          'Worked with small teams to implement designs.',
        ],
      },
    ],
  },
  {
    company: 'Olivet Nazarene University',
    totalDuration: '3 yrs 1 mo',
    roles: [
      {
        title: 'Web Developer',
        period: 'May 2008 – Aug 2010 · 2 yrs 4 mos',
        location: 'Bourbonnais, IL',
        bullets: [
          'Built an online Employment Application using PHP, JavaScript, and jQuery.',
          'Created a Financial Aid application using Perl, MySQL, JavaScript, and jQuery.',
          'Migrated several applications from Perl to PHP with updated UIs.',
          'Built a site for the Chaplain\'s office using Drupal, CSS, and jQuery UI.',
          'Deployed cross-browser-compatible applications on an Ubuntu server using Eclipse and PuTTY.',
        ],
      },
      {
        title: 'Computer Science Lab Assistant',
        period: 'Aug 2007 – Mar 2009 · 1 yr 8 mos',
        location: 'Bourbonnais, IL',
        bullets: [
          'Assisted students with Java, C++, HTML, JavaScript, PHP, SQL, and general CS topics.',
          'Administered two departmental servers on Unix/Linux.',
          'Helped migrate the department website and programs from Solaris to SUSE SLES.',
        ],
      },
    ],
  },
]
