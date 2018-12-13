import {Link} from 'react-router-dom';
import React from 'react';
import {Button} from 'kf-uikit';
import TimeAgo from 'react-timeago';

const ReleaseList = ({releases}) => {
  if (releases !== null) {
    return (
      <table className="w-full">
        <thead className="border-grey-lightest border-b h-16">
          <tr>
            <th>Release</th>
            <th>Name</th>
            <th className="text-right">Author</th>
            <th className="text-center">Version</th>
            <th className="text-center">State</th>
            <th className="text-right">Created At</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(releases).map((release, i) => (
            <ReleaseRow release={release} />
          ))}
        </tbody>
      </table>
    );
  } else {
    return <div>Nothing</div>;
  }
};

const ReleaseRow = ({release}) => (
  <tr className="border-grey-lightest border-b h-16">
    <td>
      <Link to={`/releases/${release.kf_id}`}>
        <Button className="w-full">{release.kf_id}</Button>
      </Link>
    </td>
    <td className="pl-2">{release.name}</td>
    <td className="text-right">{release.author}</td>
    <td className="text-center">{release.version}</td>
    <td className="text-center">{release.state}</td>
    <td className="text-right">
      <TimeAgo date={release.created_at} />
    </td>
  </tr>
);

export default ReleaseList;
