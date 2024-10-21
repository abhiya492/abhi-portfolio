import PropTypes from "prop-types";

const ProjectCard = ({
    imgSrc,
    title,
    tags,
    projectLink,
    classes
}) => {
    return (
        <div className={"relative p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700/40 active:bg-zinc-600/70 ring-1 ring-inset ring-zinc-50/5 transition-colors" + classes}>
            <figure className="img-box aspect-square rounded-lg
            mb-5">
                <img 
                src={imgSrc} 
                alt={title}
                loading="lazy"
                className="img-cover" 
                />
            </figure>

            <div className="flex itsms-center justify-between gap-4">
                <div>
                <h3 className="title-1 mb-3">
                    {title}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                    {tags.map((label,key) => (
                        <span key={key} 
                        className="h-8 text-sm text-zinc-400
                        bg-zinc-50/5 grid items-center px-3
                        rounded-lg ">
                            {label}
                        </span>
                    ))}
                </div>
            </div>

            <div className="w-11 h-11 rounded-lg grid place-items-center
            bg-sky-400 text-zinc-800 shrink-0">
                <span 
                className="material-symbols-rounded"
                aria-hidden="true"
                >
                    arrow-outward
                </span>
            </div>
        </div>

        <a
            href={projectLink}
            target="_blank"
            className="absoulte inset-0"
        >
            View project
        </a>
    </div>
    );
}

ProjectCard.propTypes = {
    imgSrc: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    projectLink: PropTypes.string.isRequired,
    classes: PropTypes.string
}

export default ProjectCard;
